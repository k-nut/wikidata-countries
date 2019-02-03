<template>
    <div>
        <div class="stats">
        <p> Displaying {{ xypoints.length }} cities. <br />
            Biggest: {{ stats.biggest }} inhabitants<br/>
            Smallest: {{ stats.smallest }} inhabitants</p>
        <Loader class="loader" v-bind:class="{visible: loading}" />
        </div>
        <svg v-bind:viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
            <circle v-for="point in xypoints" v-bind:cx="point.x" v-bind:cy="point.y" v-bind:r="radius" />
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
    const PADDING = 0.02;
    const xRange = maxX - minX;
    const yRange = maxY - minY;
    const xStart = minX - PADDING * xRange;
    const yStart = minY - PADDING * yRange;
    return `${xStart} ${yStart} ${xRange * 1.04} ${yRange * 1.04}`
  };

  const getRadius = (points) => {
    const {minX, maxX, minY, maxY} = getExtremes(points);
    return Math.min((maxX-minX), (maxY-minY)) / 100 / 2;
  };

  const getPopulationStats = (data) => {
    const population = data.map(d => d.population.value);
    return {
      biggest: Math.max(...population).toLocaleString(),
      smallest: Math.min(...population).toLocaleString()
    };
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
        radius: 0.01,
        stats: {biggest: 0, smallest: 0},
      };
    },
    methods: {
      updateData: function (){
        this.loading = true;
        getCities(this.country, this.count).then(response => {
          const points = response.results.bindings.map(entry => getCoordinates(entry.coordinates.value));
          this.xypoints = points.map(point => mercator(point)).map(p => ({x: p.x*100, y:p.y*100}));
          this.viewBox = getDimensions(this.xypoints);
          this.radius = getRadius(this.xypoints);
          this.loading = false;
          this.stats = getPopulationStats(response.results.bindings);
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

    .stats {
        display: flex;
        align-items: center;
    }

    .loader {
        visibility: hidden;
        margin-left: 20px;
    }
    .loader.visible {
        visibility: visible;
    }

</style>
