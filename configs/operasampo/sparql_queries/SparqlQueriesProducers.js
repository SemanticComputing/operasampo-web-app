const perspectiveID = 'producers'

export const producerProperties = `
  {
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id AS ?prefLabel__prefLabel)
    BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__dataProviderUrl)
    BIND(?id as ?uri__prefLabel)
  }
  UNION
  {
    ?id scop:additionalInfo ?additionalInfo .
    FILTER(LANG(?additionalInfo) = 'fi')
  }
  UNION
  {
    ?id scop:editorNotes ?editorNotes .
  }
  UNION
  {
    ?id ^scop:producedBy ?producedPerformances__id .
    ?producedPerformances__id a scop:Performance ;
                              scop:composition ?composition__id .
    ?composition__id a scop:Composition ;
                    skos:prefLabel ?composition__prefLabel .
    FILTER(LANG(?composition__prefLabel) = 'fi')
    ?producedPerformances__id skos:prefLabel ?producedPerformances__prefLabel .
    BIND(CONCAT("/performances/page/", REPLACE(STR(?producedPerformances__id), "^.*\\\\/(.+)", "$1")) AS ?producedPerformances__dataProviderUrl)
  }
`

export const producerPerformancesQuery = `
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
    ?id ^scop:producedBy/scop:composition ?object__id .
    {
      ?object__id skos:prefLabel ?object__compositionPrefLabel__id .
      BIND(?object__compositionPrefLabel__id as ?object__compositionPrefLabel__prefLabel)
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?object__id), "^.*\\\\/(.+)", "$1")) AS ?object__compositionPrefLabel__dataProviderUrl)
    }
    UNION
    {
      ?object__id ^scop:composition ?object__performance__id .
      ?object__performance__id a scop:Performance ;
                              scop:producedBy ?id ;
                              skos:prefLabel ?object__performance__prefLabel .
      BIND(CONCAT("/performances/page/", REPLACE(STR(?object__performance__id), "^.*\\\\/(.+)", "$1")) AS ?object__performance__dataProviderUrl)
    }
  }
`

export const performancesTimelineQuery = `
  SELECT DISTINCT ?id ?composition__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type ?performance_label ?performance_url
  WHERE {
    BIND(<ID> as ?id)
    ?id a scop:Producer .
    ?performance a scop:Performance ;
                    scop:producedBy ?id ;
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
    BIND(<ID> as ?producer)
    ?producer a scop:Producer .
    ?performance a scop:Performance ;
                scop:performanceDateStart ?_date ;
                scop:producedBy ?producer .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`
