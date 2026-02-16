const perspectiveID = 'roles'

export const roleProperties = `
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
      ?id scop:composition ?composition__id .
      ?composition__id a scop:Composition ;
                      skos:prefLabel ?composition__prefLabel .
      FILTER(LANG(?composition__prefLabel) = 'fi')
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?composition__id), "^.*\\\\/(.+)", "$1")) AS ?composition__dataProviderUrl)
    }
    UNION
    {
      ?id ^scop:compositionRole ?performanceRole .
      ?performanceRole a scop:PerformanceRole ;
                      scop:actor ?actor__id .
      ?actor__id skos:prefLabel ?actor__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?actor__id), "^.*\\\\/(.+)", "$1")) AS ?actor__dataProviderUrl)
    }
`

export const rolePerformersQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    BIND(<ID> as ?role)
    ?role a scop:Role .
    ?performanceRole a scop:PerformanceRole ;
                    scop:compositionRole ?role ;
                    scop:actor ?category ;
                    scop:performance ?performance .
    OPTIONAL {
      ?category skos:prefLabel ?prefLabel_ .
    }
    BIND(COALESCE(?prefLabel_, ?category) as ?prefLabel)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performersTimelineQuery = `
  SELECT DISTINCT ?id ?actor__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type ?performance_label ?performance_url
  WHERE {
    BIND(<ID> as ?id)
    ?id a scop:Role .
    ?performanceRole a scop:PerformanceRole ;
                    scop:compositionRole ?id ;
                    scop:performance ?performance ;
                    scop:actor ?actor .
    ?performance skos:prefLabel ?performance_label .
    BIND(CONCAT("/performances/page/", REPLACE(STR(?performance), "^.*\\\\/(.+)", "$1")) AS ?performance_url)
    ?performance scop:performanceDateStart ?_date .
    ?actor skos:prefLabel ?actor__label .
    BIND("actor" AS ?type)
  }
`

export const performancesPerformedQuery = `
  SELECT DISTINCT (STR(?year) AS ?category) (COUNT(DISTINCT ?performance) AS ?performanceCount)
  WHERE {
    BIND(<ID> as ?role)
    ?role a scop:Role .
    ?performanceRole a scop:PerformanceRole ;
                    scop:compositionRole ?role ;
                    scop:performance ?performance .
    ?performance a scop:Performance ;
                scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`

export const csvRoleQuery = `
  SELECT DISTINCT ?id ?label (GROUP_CONCAT(DISTINCT ?altLabel; separator="; ") AS ?alternative_labels) (GROUP_CONCAT(DISTINCT ?performer; separator="; ") AS ?performers) (GROUP_CONCAT(DISTINCT ?performerLabel; separator="; ") AS ?labeled_performers) ?composition ?composition_label (GROUP_CONCAT(DISTINCT ?additionalInfo; separator="; ") AS ?additional_information)
  WHERE {
    <FILTER>
    ?id a scop:Role ;
      skos:prefLabel ?label .
    FILTER(LANG(?label) = 'fi')

    OPTIONAL { ?id skos:altLabel ?altLabel . }

    OPTIONAL { 
      ?id scop:composition ?composition . 
      ?composition skos:prefLabel ?composition_label .
      FILTER(LANG(?composition_label) = "fi")
    }

    OPTIONAL {
      ?id ^scop:compositionRole/scop:actor ?performer .
      ?performer skos:prefLabel ?performerLabel .
    }

    OPTIONAL { 
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }
  } 
  GROUP BY ?id ?label ?composition ?composition_label
  ORDER BY ?id
`
