<template>
  <div id="app">
      <h1> City-Country-Shapes</h1>
      <p class="intro"> How many of a country's biggest cities does it take for you to recognize the country by the shape
      of its cities? You can try around here. Just pick a country and a number of cities to display.</p>
      <p class="intro disclaimer">This project is based on data from <a href="https://wikidata.org">Wikidata</a>.
      At times the data might not be complete and you might not get as many cities as you asked for. The great thing
      about Wikidata is that - just like Wikipedia - it is open for everyone to improve it.
         You can <a href="https://www.wikidata.org/wiki/Wikidata:Introduction">start here</a> to learn more about the project or
      get in touch with me on <a href="https://twitter.com/notknut">twitter</a>.</p>
    <div clas="settings">
      <CountryPicker v-on:selected="onCountryChange($event)" v-bind:default-value="country"/>
      <label for="count">
        City count
      </label>
      <select v-model="cityCount" id="count">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
      </select>
    </div>
    <CountryMap v-bind:country="country" v-bind:count="cityCount" />
  </div>
</template>

<script>
import CountryPicker from './components/CountryPicker'
import CountryMap from './components/CountryMap'

export default {
  name: 'app',
  components: {
    CountryPicker,
    CountryMap,
  },
  data() {
    return {
      country: "Q183",
      cityCount: 200,
    };
  },
  methods: {
    onCountryChange (country) {
      this.country = country;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.intro {
  max-width: 80ch;
}
.disclaimer {
  font-size: .8rem;
}
</style>
