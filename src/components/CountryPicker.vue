<template>
    <div>
        <label for="country">
            Country
        </label>
        <select id="country" v-model="selected" @change="change()">
            <option v-for="country in countries" v-bind:value="country.value">
                {{ country.name }}
            </option>
        </select>
    </div>
</template>

<script>
import { getCountries } from "../api";

const extractValues = (entry) => {
  const parts = entry.country.value.split("/");
  // http://www.wikidata.org/entity/Q672
  // gets the last identifier from a url like
  
  const value =  parts[parts.length - 1];
  return {
    name: entry.countryLabel.value,
    value
  };
};

export default {
  name: "CountryPicker",
  props: ['defaultValue'],
  data() {
    return {
      countries: [],
      selected: null
    };
  },
  mounted() {
    getCountries().then(response => {
      this.countries = response.results.bindings.map(extractValues);
      this.selected = this.defaultValue || this.countries[0].value;
    });
  },
  methods: {
    change () {
      this.$emit("selected", this.selected)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
