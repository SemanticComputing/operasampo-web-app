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
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performanceRole) as ?instanceCount)
  WHERE {
    BIND(<ID> as ?role)
    ?role a scop:Role .
    ?performanceRole a scop:PerformanceRole ;
                    scop:compositionRole ?role ;
                    scop:actor ?category .
    OPTIONAL {
      ?category skos:prefLabel ?prefLabel_ .
    }
    BIND(COALESCE(?prefLabel_, ?category) as ?prefLabel)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performersTimelineQuery = `
  SELECT DISTINCT ?id ?actor__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type 
  WHERE {
    BIND(<ID> as ?id)
    ?id a scop:Role .
    ?performanceRole a scop:PerformanceRole ;
                    scop:compositionRole ?id ;
                    scop:performance ?performance ;
                    scop:actor ?actor .
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