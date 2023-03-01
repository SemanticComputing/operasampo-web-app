const perspectiveID = 'performances'

export const performanceProperties = `
    {
      ?id a scop:Performance .
      # ?id skos:prefLabel ?prefLabel__id .
      # BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id scop:composition ?composition__id .
      ?composition__id skos:prefLabel ?composition__prefLabel .
      FILTER(LANG(?composition__prefLabel) = 'fi')
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?composition__id), "^.*\\\\/(.+)", "$1")) AS ?composition__dataProviderUrl)
      OPTIONAL {
        ?id scop:performanceDate ?pd .
      }
      OPTIONAL {
        ?id scop:estimatedPerformanceDateStart ?pdStart .
        ?id scop:estimatedPerformanceDateStop ?pdStop .
        BIND(CONCAT(STR(?pdStart), "–", STR(?pdStop)) as ?pdRange)
      }
      BIND(CONCAT(?composition__prefLabel, " (", COALESCE(STR(?pd), ?pdRange, "esitysajankohta ei tiedossa"), ")") as ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id scop:composition/scop:composedBy ?composer__id .
      ?composer__id skos:prefLabel ?composer__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?composer__id), "^.*\\\\/(.+)", "$1")) AS ?composer__dataProviderUrl)
    }
    UNION
    {
      ?id scop:choirLeadBy ?choirLeader__id .
      ?choirLeader__id skos:prefLabel ?choirLeader__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?choirLeader__id), "^.*\\\\/(.+)", "$1")) AS ?choirLeader__dataProviderUrl)
    }
    UNION
    {
      ?id scop:conductedBy ?conductor__id .
      ?conductor__id skos:prefLabel ?conductor__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?conductor__id), "^.*\\\\/(.+)", "$1")) AS ?conductor__dataProviderUrl)
    }
    UNION
    {
      ?id scop:directedBy ?director__id .
      ?director__id skos:prefLabel ?director__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?director__id), "^.*\\\\/(.+)", "$1")) AS ?director__dataProviderUrl)
    }
    UNION
    {
      ?id scop:producedBy ?producer__id .
      ?producer__id skos:prefLabel ?producer__prefLabel .
      BIND(CONCAT("/producers/page/", REPLACE(STR(?producer__id), "^.*\\\\/(.+)", "$1")) AS ?producer__dataProviderUrl)
    }
    UNION
    {
      ?id scop:translator ?translator__id .
      ?translator__id skos:prefLabel ?translator__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?translator__id), "^.*\\\\/(.+)", "$1")) AS ?translator__dataProviderUrl)
    }
    UNION
    {
      ?id scop:performanceDate ?performanceDate .
    }
    UNION
    {
      ?id scop:performedIn ?place__id .
      ?place__id skos:prefLabel ?place__prefLabel .
      FILTER(LANG(?place__prefLabel) = 'fi')
      BIND(CONCAT("/places/page/", REPLACE(STR(?place__id), "^.*\\\\/(.+)", "$1")) AS ?place__dataProviderUrl)
    }
    UNION
    {
      ?id scop:season ?season .
    }
    UNION
    {
      ?id scop:orchestra ?orchestra .
      FILTER(LANG(?orchestra) = 'fi')
    }
    UNION
    {
      ?id scop:tickets ?tickets .
      FILTER(LANG(?tickets) = 'fi')
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
`

export const performancesByConductorQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?performance a scop:Performance .
      ?performance scop:conductedBy ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?performance a scop:Performance .
      FILTER NOT EXISTS {
        ?performance scop:conductedBy [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancesByDirectorQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?performance a scop:Performance .
      ?performance scop:directedBy ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?performance a scop:Performance .
      FILTER NOT EXISTS {
        ?performance scop:directedBy [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancesByProducerQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?performance a scop:Performance .
      ?performance scop:producedBy ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?performance a scop:Performance .
      FILTER NOT EXISTS {
        ?performance scop:producedBy [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancesByComposerQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?performance a scop:Performance .
      ?performance scop:composition/scop:composedBy  ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?performance a scop:Performance .
      FILTER NOT EXISTS {
        ?performance scop:composition/scop:composedBy [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancesByPerformancePlaceQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?performance a scop:Performance .
      ?performance scop:performedIn ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?performance a scop:Performance .
      FILTER NOT EXISTS {
        ?performance scop:performedIn [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancesByYearQuery = `
  SELECT ?category (COUNT (DISTINCT ?performance) as ?count) WHERE {
    <FILTER>
    ?performance a scop:Performance ;
                scop:performanceDate ?date .
    BIND(YEAR(xsd:dateTime(?date)) as ?category)
  }
  GROUP BY ?category
  ORDER BY ?category
`