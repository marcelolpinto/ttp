import React, { useState } from 'react'
import { withStyles, Icon, Collapse } from '@material-ui/core';

const styles = theme => ({
  wrapper: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: theme.unit,
    padding: 2 * theme.unit,
    transition: 'border .3s',
    cursor: 'pointer',
    '& > h2': {
      maxWidth: 'calc(100% - 64px)',
    },
    '& > div.actions': {
      position: 'absolute',
      top: theme.unit,
      right: theme.unit,
      '& > *': {
        display: 'inline-block',
        marginLeft: theme.unit/2,
        cursor: 'pointer'
      }
    },
    '& > div.key-value': {
      marginTop: theme.unit,
      '& > p': {
        maxWidth: 'calc(100% - 40px)',
        paddingLeft: theme.unit,
        paddingRight: theme.unit,
      },
      '& > *': {
        display: 'inline-block',
        verticalAlign: 'middle'
      }
    },
    '& div.toggler': {
      cursor: 'pointer',
      marginBottom: theme.unit,
      '& > *': {
        verticalAlign: 'middle',
        display: 'inline-block',
      }
    },
    '& p.description': {
      lineHeight: '20px',
      whiteSpace: 'pre-wrap',
      marginTop: theme.unit,
      marginBottom: 2 * theme.unit,
    },
    '& p.rented': {
      marginTop: theme.unit,
      marginBottom: theme.unit,
      color: '#F50057',
      fontWeight: 700
    },
    '& p.price': {
      fontSize: theme.fontSizes.LG,
      fontWeight: 500,
      position: 'absolute',
      bottom: 2 * theme.unit,
      right: 2 * theme.unit,
    }
  }
});

let PropertyCard = props => {
  const {
    classes,
    property,
    isEditable,
    editAction,
    deleteAction,
    clickAction,
  } = props;
  const {
    id,
    name,
    priceString,
    bedrooms,
    description,
    address,
    areaString,
    isRented,
    realtorId
  } = property;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={clickAction} id={`card-${property.id}`} className={classes.wrapper}>
      <h2 style={{ marginBottom: '8px' }}>{name}</h2>

      {
        isEditable &&
        <div className='actions'>
          <Icon id={`edit-${id}`} onClick={editAction}>edit</Icon>
          <Icon id={`delete-${id}`} onClick={deleteAction}>delete</Icon>
        </div>
      }

      {
        isRented &&
        <p className='rented'>Rented</p>
      }

      {
         isEditable &&
        <p className='realtor'><i>Realtor - {realtorId.name}</i></p>
      }
      
      <div className='toggler' onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        <i>Description</i>
        <Icon>{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
      </div>
      <Collapse in={isOpen}>
        <p className='description'>{description}</p>
      </Collapse>

      {
        address &&
        <div className='key-value'>
          <Icon>house</Icon>
          <p style={{ verticalAlign: 'top' }}>{address}</p>
        </div>
      }
      
      <div className='key-value'>
        <Icon>square_foot</Icon>
        <p>{areaString}</p>
      </div>
      
      <div className='key-value'>
        <Icon>single_bed</Icon>
        <p>{bedrooms}</p>
      </div>

      <p className='price'>{priceString}</p>
    </div>
  )
}

PropertyCard = withStyles(styles)(PropertyCard);

export { PropertyCard };