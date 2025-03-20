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
      ?id scop:librettist ?libretist__id .
      ?libretist__id skos:prefLabel ?libretist__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?libretist__id), "^.*\\\\/(.+)", "$1")) AS ?libretist__dataProviderUrl)
    }
    UNION
    {
      ?id scop:composed ?composed .
    }
    UNION
    {
      ?id scop:published ?published .
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
      ?id ^scop:composition ?performance__id ;
          skos:prefLabel ?label .
      FILTER(LANG(?label) = 'fi')
      ?performance__id a scop:Performance .
      ?performance__id skos:prefLabel ?performance__prefLabel .
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
      ?composition a scop:Composition ;
                  scop:composedBy ?category .
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
      ?composition a scop:Composition ;
                  scop:librettist ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?composition a scop:Composition .
      FILTER NOT EXISTS {
        ?composition scop:librettist [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const performancePlacesInstancePageQuery = `
  SELECT DISTINCT ?id ?venue__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type ?performance_label ?performance_url
  WHERE {
    VALUES ?id { <ID> }
    ?performance a scop:Performance ;
                skos:prefLabel ?performance_label ;
                scop:composition ?id .
    BIND(CONCAT("/performances/page/", REPLACE(STR(?performance), "^.*\\\\/(.+)", "$1")) AS ?performance_url)
    ?performance scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    ?place skos:prefLabel ?venue__label .
    FILTER(LANG(?venue__label) = 'fi')
    BIND("venue" AS ?type)
  }
`

export const performancesPerformedInstancePageQuery = `
  SELECT DISTINCT (STR(?year) AS ?category) (COUNT(DISTINCT ?performance) AS ?performanceCount)
  WHERE {
    VALUES ?id { <ID> }
    ?performance a scop:Performance ;
                scop:composition ?id .
    ?performance scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`

export const compositionVenuesQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    BIND(<ID> as ?composition)
    ?composition a scop:Composition .
    ?performance a scop:Performance ;
                scop:composition ?composition ;
                scop:performedIn ?category .
    OPTIONAL {
      ?category skos:prefLabel ?prefLabel_ .
    }
    BIND(COALESCE(?prefLabel_, ?category) as ?prefLabel)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const csvCompositionQuery = `
  SELECT DISTINCT 
  ?id ?label (GROUP_CONCAT(DISTINCT ?altLabel; separator="; ") AS ?alternative_labels) 
  (GROUP_CONCAT(DISTINCT ?composer; separator="; ") AS ?composers) (GROUP_CONCAT(DISTINCT ?composerLabel; separator="; ") AS ?labeled_composers) 
  (GROUP_CONCAT(DISTINCT ?libretist; separator="; ") AS ?libretists) (GROUP_CONCAT(DISTINCT ?libretistLabel; separator="; ") AS ?labeled_libretists) 
  (GROUP_CONCAT(DISTINCT ?language; separator="; ") AS ?languages) ?composed (GROUP_CONCAT(DISTINCT ?published; separator="; ") AS ?premiere) (GROUP_CONCAT(DISTINCT ?additionalInfo; separator="; ") AS ?additional_information)
  WHERE {
    <FILTER>
    ?id a scop:Composition ;
      skos:prefLabel ?label .
    FILTER(LANG(?label) = 'fi')

    OPTIONAL { ?id skos:altLabel ?altLabel . }

    OPTIONAL { 
      ?id scop:composedBy ?composer . 
      ?composer skos:prefLabel ?composerLabel .
    }

    OPTIONAL { 
      ?id scop:librettist ?libretist . 
      ?libretist skos:prefLabel ?libretistLabel .
    }

    OPTIONAL { ?id scop:language ?language . }

    OPTIONAL { ?id scop:composed ?composed . }

    OPTIONAL { ?id scop:published ?published . }

    OPTIONAL { 
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }
  } 
  GROUP BY ?id ?label ?composed
  ORDER BY ?id
`

export const compositionPerformancesQuery = `
  SELECT ?id ?uri__id ?uri__prefLabel ?uri__dataProviderUrl ?prefLabel__id 
  ?object__id ?object__prefLabel 
  ?object__performancePrefLabel__id ?object__performancePrefLabel__prefLabel ?object__performancePrefLabel__dataProviderUrl
  ?object__director__id ?object__director__prefLabel ?object__director__dataProviderUrl
  ?object__producer__id ?object__producer__prefLabel ?object__producer__dataProviderUrl
  ?object__language
  ?object__place__id ?object__place__prefLabel ?object__place__dataProviderUrl
  WHERE {
    <FILTER>
    BIND(<ID> as ?id)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__prefLabel)
    BIND(?id as ?uri__dataProviderUrl)
    ?id skos:prefLabel ?prefLabel__id .
    BIND(?prefLabel__id as ?prefLabel__prefLabel)
    ?id ^scop:composition ?object__id .
    ?object__id a scop:Performance.
    {
      ?object__id skos:prefLabel ?object__performancePrefLabel__id .
      BIND(?object__performancePrefLabel__id as ?object__performancePrefLabel__prefLabel)
      BIND(CONCAT("/performances/page/", REPLACE(STR(?object__id), "^.*\\\\/(.+)", "$1")) AS ?object__performancePrefLabel__dataProviderUrl)
    }
    UNION
    {
      ?object__id scop:directedBy ?object__director__id .
      ?object__director__id skos:prefLabel ?object__director__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?object__director__id), "^.*\\\\/(.+)", "$1")) AS ?object__director__dataProviderUrl)
    }
    UNION
    {
      ?object__id scop:producedBy ?object__producer__id .
      ?object__producer__id skos:prefLabel ?object__producer__prefLabel .
      FILTER(LANG(?object__producer__prefLabel) = 'fi')
      BIND(CONCAT("/producers/page/", REPLACE(STR(?object__producer__id), "^.*\\\\/(.+)", "$1")) AS ?object__producer__dataProviderUrl)
    }
    UNION
    {
      ?object__id scop:language ?object__language .
    }
    UNION
    {
      ?object__id scop:performedIn ?object__place__id .
      ?object__place__id skos:prefLabel ?object__place__prefLabel .
      FILTER(LANG(?object__place__prefLabel) = 'fi')
      BIND(CONCAT("/places/page/", REPLACE(STR(?object__place__id), "^.*\\\\/(.+)", "$1")) AS ?object__place__dataProviderUrl)
    }
  }
`
