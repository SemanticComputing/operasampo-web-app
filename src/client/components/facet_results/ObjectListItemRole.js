import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import ObjectListItemLink from './ObjectListItemLink'

const styles = () => ({
  roleContainer: {
    width: 350,
    display: 'inline-block',
    fontWeight: 'bold'
  }
})

/**
  A component for displaying an event with or without a date in an ObjectListCollapsible.
 */
const ObjectListItemRole = props => {
  const { data, isFirstValue } = props
  const label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel
  const valuesLabel = Array.isArray(data.roleValues.prefLabel) ? data.roleValues.prefLabel[0] : data.roleValues.prefLabel
  return (
    <>
      <span className={isFirstValue ? null : props.classes.roleContainer}>
        <ObjectListItemLink
          data={data}
          label={label}
          externalLink={false}
        />&nbsp;
      </span>
      <ObjectListItemLink
        data={data.roleValues}
        label={valuesLabel}
        externalLink={false}
      />
    </>
  )
}

ObjectListItemRole.propTypes = {
  /**
   * Material-UI styles
   */
  classes: PropTypes.object,
  /**
   * An object with the following keys: id, prefLabel, date, dataProviderUrl.
   */
  data: PropTypes.object,
  /**
   * The first item in a ObjectListCollapsible is rendered differently in collapsed mode.
   */
  isFirstValue: PropTypes.bool
}

export const ObjectListItemEventComponent = ObjectListItemRole

export default withStyles(styles)(ObjectListItemRole)
