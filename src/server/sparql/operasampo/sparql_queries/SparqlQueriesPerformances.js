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
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?composition__id), "^.*\\\\/(.+)", "$1")) AS ?composition__dataProviderUrl)
      BIND(?composition__prefLabel as ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
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