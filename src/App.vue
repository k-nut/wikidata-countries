<template>
    <div id="app">
        <CountryMap v-bind:country="country" v-bind:count="cityCount"/>
        <ul class="options">
            <li v-for="choice in choices" :key="choice.value">
                <button>{{ choice.name }}</button>
            </li>
        </ul>
    </div>

</template>

<script>
  import CountryPicker from "./components/CountryPicker";
  import CountryMap from "./components/CountryMap";
  import {getCountries} from "./api";
  import {extractValues} from "./components/utils";

  const popRandom = array => {
    return array.splice(Math.floor(Math.random() * array.length), 1)[0];
  };

  export default {
    name: "app",
    components: {
      CountryMap
    },
    data() {
      return {
        country: null,
        cityCount: 500,
        choices: []
      };
    },
    methods: {
      onCountryChange(country) {
        this.country = country;
      }
    },
    mounted() {
      getCountries().then(response => {
        const condensed = response.results.bindings.map(extractValues);
        const displayCountry =  popRandom(condensed);
        const alternatives = Array.from({length: 3}).map(() => popRandom(condensed));
        this.country = displayCountry.value;
        this.choices = [...alternatives, displayCountry];
      });
    }
  };
</script>

<style>
    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        height: 100vh;
    }

    .options {
        display: flex;
        list-style-type: none;
        flex-wrap: wrap;
    }

    .options li {
        width: 50%;
        padding: 10px;
    }

    .options button {
        width: 100%;
        height: 3em;
    }
</style>
