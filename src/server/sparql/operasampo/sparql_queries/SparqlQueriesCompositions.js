const perspectiveID = 'compositions'

export const compositionProperties = `
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
      ?id scop:additionalTitle ?additionalTitle__id .
      BIND(?additionalTitle__id AS ?additionalTitle__prefLabel)
    }
    UNION
    {
      ?id scop:originalTitle ?originalTitle .
    }
    UNION
    {
      ?id scop:originalWork ?originalWork .
    }
    UNION
    {
      ?id scop:composedBy ?composer__id .
      ?composer__id skos:prefLabel ?composer__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?composer__id), "^.*\\\\/(.+)", "$1")) AS ?composer__dataProviderUrl)
    }
    UNION
    {
      ?id scop:language ?language .
    }
    UNION
    {
      ?id scop:libretist ?libretist__id .
      ?libretist__id skos:prefLabel ?libretist__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?libretist__id), "^.*\\\\/(.+)", "$1")) AS ?libretist__dataProviderUrl)
    }
    UNION
    {
      ?id scop:composed ?composed .
    }
    UNION
    {
      ?id scop:firstPerformancePlace ?firstPerformancePlace .
    }
    UNION
    {
      ?id scop:published ?published .
    }
    UNION
    {
      ?id scop:publishedDate ?publishedDate .
    }
    UNION
    {
      ?id scop:opus ?opus .
    }
    UNION
    {
      ?id scop:catalogue ?catalogue .
    }
    UNION
    {
      ?id ^scop:composition ?performance__id .
      ?performance__id a scop:Performance .
      ?id skos:prefLabel ?label .
      FILTER(LANG(?label) = 'fi')
      OPTIONAL {
        ?performance__id skos:prefLabel ?p_name .
      }
      OPTIONAL {
        ?performance__id scop:performanceDate ?pd .
        ?pd skos:prefLabel ?pd_label .
      }
      BIND(CONCAT(?label, " (", COALESCE(?pd_label, "esitysajankohta ei tiedossa"), ")") as ?backup_label)
      BIND(COALESCE(?p_name, ?backup_label) as ?performance__prefLabel)
      BIND(CONCAT("/performances/page/", REPLACE(STR(?performance__id), "^.*\\\\/(.+)", "$1")) AS ?performance__dataProviderUrl)
    }
    UNION
    {
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }
    UNION
    {
      ?id ^scop:composition ?role__id .
      ?role__id a scop:Role ;
                skos:prefLabel ?role__prefLabel .
      FILTER(LANG(?role__prefLabel) = 'fi')
      BIND(CONCAT("/roles/page/", REPLACE(STR(?role__id), "^.*\\\\/(.+)", "$1")) AS ?role__dataProviderUrl)
    }
    UNION
    {
      ?id scop:editorNotes ?editorNotes .
    }
`

export const compositionsByComposerQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?composition) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?composition a scop:Composition .
      ?composition scop:composedBy ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?composition a scop:Composition .
      FILTER NOT EXISTS {
        ?composition scop:composedBy [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const compositionsByLibretistQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?composition) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?composition a scop:Composition .
      ?composition scop:libretist ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?composition a scop:Composition .
      FILTER NOT EXISTS {
        ?composition scop:libretist [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`