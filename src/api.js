class SPARQLQueryDispatcher {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  query(sparqlQuery) {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { Accept: "application/sparql-results+json" };

    return fetch(fullUrl, { headers }).then(body => body.json());
  }
}

const endpointUrl = "https://query.wikidata.org/sparql";
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

export const getCountries = () => {
  const sparqlQuery = `
  SELECT DISTINCT ?country ?countryLabel WHERE {
  ?country wdt:P31/wdt:P279* wd:Q3624078;
         p:P463 ?memberOfStatement.
  ?memberOfStatement a wikibase:BestRank;
                     ps:P463 wd:Q1065.
  ?country wdt:P1082 ?population
  MINUS { ?memberOfStatement pq:P582 ?endTime. }
  MINUS { ?country wdt:P576|wdt:P582 ?end. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?population)`;
  return queryDispatcher.query(sparqlQuery)
};

export const getCities = (country, count) => {
  const sparqlQuery = `
SELECT distinct ?city ?coordinates ?population
WHERE
{
    BIND(<${country}> AS ?country)

    {?city wdt:P31/wdt:P279* wd:Q515 }
    UNION 
    {?city wdt:P31/wdt:P279* wd:Q7930989 } .
    ?city wdt:P1082 ?population .          
    ?city wdt:P17 ?country .          
    ?city wdt:P625 ?coordinates .
}
ORDER BY DESC(?population)
LIMIT ${count}
`;
  return queryDispatcher.query(sparqlQuery)
};
