<template>
    <div>
        <p> Displaying {{ visibleCount }} cities</p>
        <Loader class="loader" v-bind:class="{visible: loading}" />
        <svg v-bind:viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
            <circle v-for="point in xypoints"
                    v-bind:key="point.city"
                    v-bind:cx="point.x"
                    v-bind:cy="point.y"
                    v-bind:r="radius"
                    v-bind:visibility="point.visible ? 'visible': 'hidden'"
            />
        </svg>
    </div>
</template>

<script>
  import mercator from "projections/mercator";
  import {getCities} from "../api";
  import Loader from "./Loader";

  const getCoordinates = (pointString) => {
    const [, lon, lat] = /Point\((.*) (.*)\)/.exec(pointString);
    return {lat, lon}
  };

  const getExtremes = points => {
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    return {minX, maxX, minY, maxY}
  };

  const getDimensions = (points) => {
    const {minX, maxX, minY, maxY} = getExtremes(points);
    return `${minX * 0.998} ${minY * 0.998} ${maxX-minX} ${maxY-minY}`
  };

  const getRadius = (points) => {
    const {minX, maxX, minY, maxY} = getExtremes(points);
    return Math.min((maxX-minX), (maxY-minY)) / 100 / 2;
  };

  // https://ilikekillnerds.com/2016/05/removing-duplicate-objects-array-property-name-javascript/
  function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  export default {
    name: "CountryMap",
    props: ['country', 'count'],
    components: {
      Loader,
    },
    data() {
      return {
        xypoints: [],
        viewBox: '0 0 100 100',
        loading: true,
        radius: 0.01,
        visibleCount: 1,
      };
    },
    methods: {
      updateData: function (){
        this.loading = true;
        getCities(this.country, this.count).then(response => {
          const points = response.results.bindings.map(entry => {
            return {
              city: entry.city.value,
              ...getCoordinates(entry.coordinates.value)
            }
          });
          this.xypoints = removeDuplicates(points, 'city').map(point => {
            const projected = mercator(point);
            return {
              ...point,
              visible: false,
              x: projected.x * 100,
              y: projected.y * 100,
            };
          });
          this.updateVisibility();
          this.viewBox = getDimensions(this.xypoints);
          this.radius = getRadius(this.xypoints);
          this.loading = false;
        });
      },
      updateVisibility(){
        if (this.visibleCount < this.xypoints.length){
          this.xypoints[this.visibleCount].visible = true;
          this.visibleCount += 1;
          setTimeout(this.updateVisibility, 100);
        }
      }
    },
    watch: {
      country: function () { this.updateData() },
      count: function() { this.updateData() },
    },
    mounted() {
      this.updateData()
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    svg {
        border: 1px solid lightgray;
        max-width: 100%;
        max-height: 80vh;
    }

    .loader {
        visibility: hidden;
    }
    .loader.visible {
        visibility: visible;
    }

</style>
