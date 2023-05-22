const perspectiveID = 'places'

export const placeProperties = `
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
      ?id scop:address ?address .
      FILTER(LANG(?address) = 'fi')
    }
    UNION
    {
      ?id scop:city ?city .
      FILTER(LANG(?city) = 'fi')
    }
    UNION
    {
      ?id scop:country ?country .
      FILTER(LANG(?country) = 'fi')
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
      ?id ^scop:place ?image__id .
      ?image__id a scop:PlaceImage ;
                scop:imageUrl ?image__url ;
                skos:prefLabel ?image__description .
    }
`