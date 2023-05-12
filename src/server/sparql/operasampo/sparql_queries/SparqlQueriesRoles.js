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
                    scop:compositionRole ?role .
    ?performanceRole scop:actor ?category .
    OPTIONAL {
      ?category skos:prefLabel ?prefLabel_ .
    }
    BIND(COALESCE(?prefLabel_, ?category) as ?prefLabel)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`