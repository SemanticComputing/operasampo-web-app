const perspectiveID = 'performances'

export const performanceProperties = `
    {
      ?id a scop:Performance .

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
        ?id skos:prefLabel ?p_name .
      }
      OPTIONAL {
        ?id scop:performanceDateStart ?pd .
        BIND(STR(xsd:date(?pd)) as ?pd_label)
      }
      BIND(CONCAT(?composition__prefLabel, " (", COALESCE(?pd_label, "esitysajankohta ei tiedossa"), ")") as ?backup_label)
      BIND(COALESCE(?p_name, ?backup_label) as ?prefLabel__prefLabel)
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
      ?id scop:composition/scop:libretist ?libretist__id .
      ?libretist__id skos:prefLabel ?libretist__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?libretist__id), "^.*\\\\/(.+)", "$1")) AS ?libretist__dataProviderUrl)
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
      ?id scop:language ?language .
    }
    UNION
    {
      ?id scop:translator ?translator__id .
      ?translator__id skos:prefLabel ?translator__prefLabel .
      BIND(CONCAT("/people/page/", REPLACE(STR(?translator__id), "^.*\\\\/(.+)", "$1")) AS ?translator__dataProviderUrl)
    }
    UNION
    {
      ?id scop:performanceDateStart ?performanceDate_s ;
          scop:performanceDateEnd ?performanceDate_e .
      BIND(xsd:date(?performanceDate_s) as ?performanceDate__start)
      BIND(xsd:date(?performanceDate_e) as ?performanceDate__end)
      BIND(IF(?performanceDate__start = ?performanceDate__end, STR(?performanceDate__start), CONCAT(STR(?performanceDate__start), '–', STR(?performanceDate__end))) as ?performanceDate__prefLabel)
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
    UNION
    {
      ?compositionId a scop:Composition ;
                  ^scop:composition ?id .
      ?performanceRole__id a scop:Role ;
            scop:composition ?compositionId .
      OPTIONAL {
        ?performanceRoleId a scop:PerformanceRole ;
                        scop:performance ?id ;
                        scop:actor ?performerId ;
                        scop:compositionRole ?performanceRole__id .
        ?performerId skos:prefLabel ?performerLabel .
        BIND(CONCAT("/people/page/", REPLACE(STR(?performerId), "^.*\\\\/(.+)", "$1")) AS ?performanceRole__roleValues__dataProviderUrl)
      }
      BIND(COALESCE(?performerId, <http://ldf.fi/MISSING_VALUE>) as ?performanceRole__roleValues__id)
      BIND(COALESCE(?performerLabel, '-') as ?performanceRole__roleValues__prefLabel)
      ?performanceRole__id skos:prefLabel ?performanceRole__prefLabel .
      FILTER(LANG(?performanceRole__prefLabel) = 'fi')
      BIND(CONCAT("/roles/page/", REPLACE(STR(?performanceRole__id), "^.*\\\\/(.+)", "$1")) AS ?performanceRole__dataProviderUrl)
    }
    UNION 
    {
      ?id ^scop:performance ?image__id .
      ?image__id a scop:PerformanceImage ;
                scop:imageUrl ?image__url .
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
      ?performance a scop:Performance ;
                  scop:producedBy ?category .
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
      ?performance a scop:Performance ;
                  scop:composition/scop:composedBy  ?category .
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
      ?performance a scop:Performance ;
                  scop:performedIn ?category .
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
                scop:performanceDateStart ?date .
    BIND(YEAR(xsd:date(?date)) as ?category)
  }
  GROUP BY ?category
  ORDER BY ?category
`

export const performancePlacesQuery = `
  SELECT DISTINCT ?id ?esityspaikka__label (xsd:date(?_date) AS ?date) (year(xsd:date(?_date)) AS ?year) ?type 
  WHERE {
    <FILTER>
    ?id a scop:Performance ;
          scop:performanceDateStart ?_date ;
          scop:performedIn ?place .
    ?place skos:prefLabel ?esityspaikka__label .
    FILTER(LANG(?esityspaikka__label) = 'fi')
    BIND("esityspaikka" AS ?type)
  }
`

export const performancesPerformedQuery = `
  SELECT DISTINCT (STR(?year) AS ?category) (COUNT(DISTINCT ?performance) AS ?performanceCount)
  WHERE {
    <FILTER>
    ?performance a scop:Performance ;
                scop:performanceDateStart ?_date ;
                scop:performedIn ?place .
    BIND(YEAR(xsd:date(?_date)) AS ?year)
  }
  GROUP BY ?year ORDER BY ?year
`