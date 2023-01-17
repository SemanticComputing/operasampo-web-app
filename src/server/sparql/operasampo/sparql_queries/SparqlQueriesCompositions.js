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
      ?id scop:compositionYear ?compositionYear .
    }
    UNION
    {
      ?id scop:firstPerformedDate ?firstPerformedDate .
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
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }
    UNION
    {
      ?id scop:editorNotes ?editorNotes .
    }
`