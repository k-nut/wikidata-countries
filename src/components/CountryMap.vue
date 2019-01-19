<template>
    <div>
        <p> Displaying {{ xypoints.length }} cities</p>
        <Loader class="loader" v-bind:class="{visible: loading}" />
        <svg v-bind:viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
            <circle v-for="point in xypoints" v-bind:cx="point.x" v-bind:cy="point.y" r="0.01" />
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
      };
    },
    methods: {
      updateData: function (){
        this.loading = true;
        getCities(this.country, this.count).then(response => {
          const points = response.results.bindings.map(entry => getCoordinates(entry.coordinates.value));
          this.xypoints = points.map(point => mercator(point)).map(p => ({x: p.x*100, y:p.y*100}));
          this.viewBox = getDimensions(this.xypoints);
          this.loading = false;
        });
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
        width: 100%;
    }

    .loader {
        visibility: hidden;
    }
    .loader.visible {
        visibility: visible;
    }

</style>
