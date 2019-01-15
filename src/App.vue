<template>
  <div id="app">
    <div clas="settings">
      <CountryPicker v-on:selected="onCountryChange($event)"/>
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
      cityCount: 50,
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
</style>
