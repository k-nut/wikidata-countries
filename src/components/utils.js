export const extractValues = (entry) => {
  const parts = entry.country.value.split("/");
  // http://www.wikidata.org/entity/Q672
  // gets the last identifier from a url like

  const value = parts[parts.length - 1];
  return {
    name: entry.countryLabel.value,
    value
  };
};