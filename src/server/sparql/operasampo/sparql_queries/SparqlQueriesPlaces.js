const perspectiveID = 'places'

export const placeProperties = `
  {
    ?id skos:prefLabel ?prefLabel__id .
    FILTER(LANG(?prefLabel__id) = 'fi')
    BIND(?prefLabel__id AS ?prefLabel__prefLabel)
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__dataProviderUrl)
    BIND(?id as ?uri__prefLabel)
  }
  UNION
  {
    ?id skos:altLabel ?altLabel .
  }
  UNION
  {
    ?id scop:address ?address .
    FILTER(LANG(?address) = 'fi')
  }
  UNION
  {
    ?id scop:city ?city .
    FILTER(LANG(?city) = 'fi')
  }
  UNION
  {
    ?id scop:country ?country .
    FILTER(LANG(?country) = 'fi')
  }
  UNION
  {
    ?id scop:additionalInfo ?additionalInfo .
    FILTER(LANG(?additionalInfo) = 'fi')
  }
  UNION
  {
    ?id ^scop:place ?image__id .
    ?image__id a scop:PlaceImage ;
              scop:imageUrl ?image__url ;
              skos:prefLabel ?image__description .
  }
`

export const csvPlaceQuery = `
  SELECT DISTINCT ?id ?label (GROUP_CONCAT(DISTINCT ?altLabel; separator="; ") AS ?alternative_labels) ?address ?city ?country (GROUP_CONCAT(DISTINCT ?additionalInfo; separator="; ") AS ?additional_information)
  WHERE {
    <FILTER>
    ?id a scop:Place ;
      skos:prefLabel ?label .
    FILTER(LANG(?label) = 'fi')

    OPTIONAL { ?id skos:altLabel ?altLabel . }

    OPTIONAL { 
      ?id scop:address ?address .
      FILTER(LANG(?address) = 'fi')
    }
    
    OPTIONAL { 
      ?id scop:city ?city .
      FILTER(LANG(?city) = 'fi')
    }
    
    OPTIONAL { 
      ?id scop:country ?country .
      FILTER(LANG(?country) = 'fi')
    }

    OPTIONAL { 
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }
  } 
  GROUP BY ?id ?label ?address ?city ?country
  ORDER BY ?id
`
