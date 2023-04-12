import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import ObjectListItemLink from './ObjectListItemLink'

const styles = () => ({
  roleContainer: {
    width: 200,
    display: 'inline-block',
    fontWeight: 'bold',
    verticalAlign: 'top'
  },
  valueContainer: {
    display: 'inline-block',
    verticalAlign: 'top'
  }
})

/**
  A component for displaying an event with or without a date in an ObjectListCollapsible.
 */
const ObjectListItemRole = props => {
  const { data, isFirstValue } = props
  const label = Array.isArray(data.prefLabel) ? data.prefLabel[0] : data.prefLabel
  return (
    <>
      <span className={isFirstValue ? null : props.classes.roleContainer}>
        <ObjectListItemLink
          data={data}
          label={label}
          externalLink={false}
        />&nbsp;
      </span>
      <span className={props.classes.valueContainer}>
        {
        Array.isArray(data.roleValues)
          ? (
            <ul>
              {data.roleValues.map(item => {
                return (
                  <li key={item.id}>
                    <ObjectListItemLink
                      data={item}
                      label={Array.isArray(item.prefLabel) ? item.prefLabel[0] : item.prefLabel}
                      externalLink={false}
                    />
                  </li>
                )
              })}
            </ul>
            )
          : <ObjectListItemLink
              data={data.roleValues}
              label={Array.isArray(data.roleValues.prefLabel) ? data.roleValues.prefLabel[0] : data.roleValues.prefLabel}
              externalLink={false}
            />
        }
      </span>
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
