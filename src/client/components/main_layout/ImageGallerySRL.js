import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { SRLWrapper, useLightbox } from 'simple-react-lightbox'
import Button from '@mui/material/Button'

const useStyles = makeStyles({
  previewImage: {
    border: '1px solid lightgray'
  }
})

const options = {
  settings: {
    hideControlsAfter: false
  },
  caption: {
    captionFontFamily: 'roboto'
  }
}

const optionsSingleImage = {
  ...options,
  thumbnails: {
    showThumbnails: false
  },
  buttons: {
    showPrevButton: false,
    showNextButton: false,
    showAutoplayButton: false
  }
}

const ImageGallerySRL = props => {
  const classes = useStyles()
  const { openLightbox } = useLightbox()
  let { data } = props
  let srlOptions = options
  if (!Array.isArray(data)) {
    data = [data]
    srlOptions = optionsSingleImage
  }

  function importAll (r) {
    const imageCache = {}
    r.keys().map(item => (imageCache[item.replace('./', '')] = r(item)))
    return imageCache
  }

  const images = data.map(item => {
    let tempUrl = item.url
    const absoluteUrlRegExp = /^(?:[a-z]+:)?\/\//i
    if (!absoluteUrlRegExp.test(item.url)) {
      const importedImages = importAll(require.context('../../img/', true, /\.(png|jpg)$/))
      if (importedImages[item.url] !== undefined) {
        tempUrl = importedImages[item.url].default
      }
    }
    return {
      src: tempUrl,
      thumbnail: tempUrl,
      caption: item.description
    }
  })

  return (
    <>
      <Button aria-label='open larger image' onClick={() => openLightbox()}>
        <img
          className={classes.previewImage}
          height={props.previewImageHeight}
          src={images[0].src}
          alt='preview image'
        />
      </Button>
      <SRLWrapper options={srlOptions} elements={images} />
    </>
  )
}

export default ImageGallerySRL
