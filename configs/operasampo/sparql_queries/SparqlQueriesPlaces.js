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

export const placePerformancesQuery = `
  SELECT ?id ?uri__id ?uri__prefLabel ?uri__dataProviderUrl ?prefLabel__id 
  ?object__id ?object__prefLabel 
  ?object__compositionPrefLabel__id ?object__compositionPrefLabel__prefLabel ?object__compositionPrefLabel__dataProviderUrl
  ?object__performance__id ?object__performance__prefLabel ?object__performance__dataProviderUrl
  WHERE {
    <FILTER>
    BIND(<ID> as ?id)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__prefLabel)
    BIND(?id as ?uri__dataProviderUrl)
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    ?id ^scop:performedIn/scop:composition ?object__id .
    {
      ?object__id skos:prefLabel ?object__compositionPrefLabel__id .
      BIND(?object__compositionPrefLabel__id as ?object__compositionPrefLabel__prefLabel)
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?object__id), "^.*\\\\/(.+)", "$1")) AS ?object__compositionPrefLabel__dataProviderUrl)
    }
    UNION
    {
      ?object__id ^scop:composition ?object__performance__id .
      ?object__performance__id a scop:Performance ;
                              scop:performedIn ?id ;
                              skos:prefLabel ?object__performance__prefLabel .
      BIND(CONCAT("/performances/page/", REPLACE(STR(?object__performance__id), "^.*\\\\/(.+)", "$1")) AS ?object__performance__dataProviderUrl)
    }
  }
`

export const performancesTimelineQuery = `
  SELECT DISTINCT ?id ?composition__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type ?performance_label ?performance_url
  WHERE {
    BIND(<ID> as ?id)
    ?id a scop:Place .
    ?performance a scop:Performance ;
                    scop:performedIn ?id ;
                    scop:composition ?composition .
    ?performance skos:prefLabel ?performance_label .
    BIND(CONCAT("/performances/page/", REPLACE(STR(?performance), "^.*\\\\/(.+)", "$1")) AS ?performance_url)
    ?performance scop:performanceDateStart ?_date .
    ?composition skos:prefLabel ?composition__label .
    FILTER(LANG(?composition__label) = 'fi')
    BIND("composition" AS ?type)
  }
`

export const performancesPerformedQuery = `
  SELECT DISTINCT (STR(?year) AS ?category) (COUNT(DISTINCT ?performance) AS ?performanceCount)
  WHERE {
    BIND(<ID> as ?place)
    ?place a scop:Place .
    ?performance a scop:Performance ;
                scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`
