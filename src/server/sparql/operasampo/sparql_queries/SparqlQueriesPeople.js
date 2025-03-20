const perspectiveID = 'people'

export const personProperties = `
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
      ?id skos:altLabel ?altLabel .
    }
    UNION
    {
      ?id foaf:firstName ?firstName .
    }
    UNION
    {
      ?id foaf:surname ?lastName .
    }
    UNION
    {
      ?id scop:role ?role__id .
      ?role__id skos:prefLabel ?role__prefLabel .
      FILTER(LANG(?role__prefLabel) = 'fi')
    }
    UNION
    {
      ?id scop:nationality ?nationality .
    }
    UNION
    {
      ?id scop:language ?language .
    }
    UNION
    {
      ?id scop:dateOfBirth ?dateOfBirth .
    }
    UNION
    {
      ?id scop:placeOfBirth ?placeOfBirth .
    }
    UNION
    {
      ?id scop:dateOfDeath ?dateOfDeath .
    }
    UNION
    {
      ?id scop:placeOfDeath ?placeOfDeath .
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
      ?id ^scop:composedBy ?composedWork__id .
      ?composedWork__id skos:prefLabel ?composedWork__prefLabel .
      FILTER(LANG(?composedWork__prefLabel) = 'fi')
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?composedWork__id), "^.*\\\\/(.+)", "$1")) AS ?composedWork__dataProviderUrl)
    }
    UNION
    {
      ?id ^scop:libretist ?libretto__id .
      ?libretto__id skos:prefLabel ?libretto__prefLabel .
      FILTER(LANG(?libretto__prefLabel) = 'fi')
      BIND(CONCAT("/compositions/page/", REPLACE(STR(?libretto__id), "^.*\\\\/(.+)", "$1")) AS ?libretto__dataProviderUrl)
    }
    UNION
    {
      ?id ^scop:actor ?pr .
      ?pr a scop:PerformanceRole ;
                      scop:compositionRole ?roleCharacter__id .
      ?roleCharacter__id skos:prefLabel ?prefLabel_ ;
                        scop:composition ?composition .
      FILTER(LANG(?prefLabel_) = 'fi')
      ?composition skos:prefLabel ?comp_pref_fi .
      FILTER(LANG(?comp_pref_fi) = 'fi')
      BIND(COALESCE(?prefLabel_, ?roleCharacter__id) as ?rc_pref)
      BIND(CONCAT(?rc_pref, " (", ?comp_pref_fi, ")") as ?roleCharacter__prefLabel)
      BIND(CONCAT("/roles/page/", REPLACE(STR(?roleCharacter__id), "^.*\\\\/(.+)", "$1")) AS ?roleCharacter__dataProviderUrl)
    }
    UNION
    {
      ?performanceRole__performanceRoleId a scop:PerformanceRole ;
            scop:actor ?id ;
            scop:performance ?performanceRole__roleValues__id ;
            scop:compositionRole ?performanceRole__id .
      ?performanceRole__roleValues__id skos:prefLabel ?performanceRole__roleValues__prefLabel .
      BIND(CONCAT("/performances/page/", REPLACE(STR(?performanceRole__roleValues__id), "^.*\\\\/(.+)", "$1")) AS ?performanceRole__roleValues__dataProviderUrl)
      ?performanceRole__id skos:prefLabel ?performanceRole__prefLabel .
      FILTER(LANG(?performanceRole__prefLabel) = 'fi')
      BIND(CONCAT("/roles/page/", REPLACE(STR(?performanceRole__id), "^.*\\\\/(.+)", "$1")) AS ?performanceRole__dataProviderUrl)
    }
    UNION
    {
      ?id scop:biographySampo ?biographySampo__id, ?biographySampo__prefLabel, ?biographySampo__dataProviderUrl .
    }
    UNION
    {
      ?id scop:wikidata ?wikidata__id, ?wikidata__prefLabel, ?wikidata__dataProviderUrl .
    }
`

export const personRolesQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?performance) as ?instanceCount)
  WHERE {
    BIND(<ID> as ?person)
    ?person a scop:Person .
    ?performanceRole a scop:PerformanceRole ;
                    scop:actor ?person ;
                    scop:performance ?performance .
    ?performanceRole scop:compositionRole ?category .
    OPTIONAL {
      ?category skos:prefLabel ?prefLabel_ .
      FILTER(LANG(?prefLabel_) = 'fi')
    }
    BIND(COALESCE(?prefLabel_, ?category) as ?prefLabel)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const personInstancePageNetworkLinksQuery = `
  SELECT DISTINCT ?source ?target (COUNT(DISTINCT ?performance) as ?weight)
  WHERE {
    VALUES ?id { <ID> }
    ?id ^scop:actor/scop:performance ?performance .
    ?target ^scop:actor/scop:performance ?performance .
    FILTER(?id != ?target)
    BIND(?id as ?source)
  }
  GROUP BY ?source ?target
`

export const personNetworkNodesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?class ?href
  WHERE {
    VALUES ?class { scop:Person }
    VALUES ?id { <ID_SET> }
    ?id a ?class ;
      skos:prefLabel ?prefLabel .
    BIND(CONCAT("/people/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?href)
  }
`

export const rolesTimelineQuery = `
  SELECT DISTINCT ?id ?role__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type ?performance_label ?performance_url
  WHERE {
    BIND(<ID> as ?id)
    ?id a scop:Person .
    ?performanceRole a scop:PerformanceRole ;
                    scop:actor ?id ;
                    scop:compositionRole ?role ;
                    scop:performance ?performance .
    ?performance skos:prefLabel ?performance_label .
    BIND(CONCAT("/performances/page/", REPLACE(STR(?performance), "^.*\\\\/(.+)", "$1")) AS ?performance_url)
    ?performance scop:performanceDateStart ?_date .
    ?role skos:prefLabel ?role__label .
    FILTER(LANG(?role__label) = 'fi')
    BIND("role" AS ?type)
  }
`

export const performancesPerformedQuery = `
  SELECT DISTINCT (STR(?year) AS ?category) (COUNT(DISTINCT ?performance) AS ?performanceCount)
  WHERE {
    BIND(<ID> as ?person)
    ?person a scop:Person .
    ?performanceRole a scop:PerformanceRole ;
                    scop:actor ?person ;
                    scop:performance ?performance .
    ?performance a scop:Performance ;
                scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`

export const peopleByRoleQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?person) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?person a scop:Person ;
              scop:role ?category .
      ?category skos:prefLabel ?prefLabel .
      FILTER(LANG(?prefLabel) = 'fi')
    }
    UNION
    {
      ?person a scop:Person .
      FILTER NOT EXISTS {
        ?person scop:role [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const peopleByRelatedCompositionQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?person) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?person a scop:Person ;
              (((^scop:actor/scop:performance)|^scop:choirLedBy|^scop:conductedBy|^scop:directedBy|^scop:translator)/scop:composition)|^scop:composedBy|^scop:libretist ?category .
      ?category skos:prefLabel ?prefLabel .
      FILTER(LANG(?prefLabel) = 'fi')
    }
    UNION
    {
      ?person a scop:Person .
      FILTER NOT EXISTS {
        ?person (((^scop:actor/scop:performance)|^scop:choirLedBy|^scop:conductedBy|^scop:directedBy|^scop:translator)/scop:composition)|^scop:composedBy|^scop:libretist [] .
      }
      BIND("Tuntematon" as ?category)
      BIND("Tuntematon" as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const csvPersonQuery = `
  SELECT DISTINCT 
  ?id ?label (GROUP_CONCAT(DISTINCT ?altLabel; separator="; ") AS ?alternative_labels) 
  (GROUP_CONCAT(DISTINCT ?firstName; separator="; ") AS ?first_names) (GROUP_CONCAT(DISTINCT ?lastName; separator="; ") AS ?last_names) 
  (GROUP_CONCAT(DISTINCT ?occupationRole; separator="; ") AS ?occupation_roles)
  (GROUP_CONCAT(DISTINCT ?nationality; separator="; ") AS ?nationalities) (GROUP_CONCAT(DISTINCT ?language; separator="; ") AS ?languages)
  ?date_of_birth ?place_of_birth ?date_of_death ?place_of_death
  (GROUP_CONCAT(DISTINCT ?additionalInfo; separator="; ") AS ?additional_information) 
  ?biographysampo_uri ?wikidata_uri
  WHERE {
    <FILTER>
    ?id a scop:Person ;
      skos:prefLabel ?label .
    FILTER(LANG(?label) = 'fi')

    OPTIONAL { ?id skos:altLabel ?altLabel . }

    OPTIONAL { ?id foaf:firstNAme ?firstName . }
    OPTIONAL { ?id foaf:surname ?lastName . }

    OPTIONAL {
      ?id scop:role/skos:prefLabel ?occupationRole .
      FILTER(LANG(?occupationRole) = 'fi')
    }

    OPTIONAL { ?id scop:nationality ?nationality . }
    OPTIONAL { ?id scop:language ?language . }

    OPTIONAL { ?id scop:dateOfBirth ?date_of_birth . }
    OPTIONAL { ?id scop:placeOfBirth ?place_of_birth . }

    OPTIONAL { ?id scop:dateOfDeath ?date_of_death . }
    OPTIONAL { ?id scop:placeOfDeath ?place_of_death . }

    OPTIONAL { 
      ?id scop:additionalInfo ?additionalInfo .
      FILTER(LANG(?additionalInfo) = 'fi')
    }

    OPTIONAL { ?id scop:biographySampo ?biographysampo_uri . }
    OPTIONAL { ?id scop:wikidata ?wikidata_uri . }
  } 
  GROUP BY ?id ?label ?date_of_birth ?place_of_birth ?date_of_death ?place_of_death ?biographysampo_uri ?wikidata_uri
  ORDER BY ?id
`