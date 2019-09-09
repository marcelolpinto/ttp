import React from 'react'
import { connect } from 'react-redux';
import { withStyles, Button } from '@material-ui/core';
import compose from 'recompose/compose';

import { BaseContainer } from '../../helpers';
import { PropertiesController } from './Properties.controller';
import {
  showLoadingAction,
  closeLoadingAction,
  setPropertiesAction,
  openModalAction,
  closeModalAction,
} from '../../store/actions';
import { MapComponent } from '../../components/_lib/Map.component';
import { PropertyCard } from './Property.card';
import { PropertyFilters } from './Property.filters';

const actions = {
  showLoadingAction,
  closeLoadingAction,
  setPropertiesAction,
  openModalAction,
  closeModalAction,
};

const MIN_LIST_WIDTH = '400px';

const styles = theme => ({
  wrapper: {
    '& > div.list': {
      padding: 2 * theme.unit,
      width: '25%',
      minWidth: MIN_LIST_WIDTH,
      height: 'calc(100vh - 64px)',
      maxHeight: '100%',
      overflowY: 'auto',
      display: 'inline-block',
      verticalAlign: 'top',
      backgroundColor: theme.colors.gray.bg,
      '& > div.head': {
        '& > *': {
          display: 'inline-block',
          verticalAlign: 'middle',
        },
        '& > button': {
          ...theme.buttons.primary,
          float: 'right'
        }
      },
      '& > div.body': {
        marginTop: 2 * theme.unit,
        paddingBottom: 4 * theme.unit,
        '& > div + div': {
          marginTop: 2 * theme.unit,
        }
      }
    },
    '& > div.map': {
      boxShadow: theme.shadows[1],
      width: '75%',
      maxWidth: `calc(100vw - ${MIN_LIST_WIDTH})`,
      height: 'calc(100vh - 64px)',
      display: 'inline-block',
      verticalAlign: 'top',
    }
  },

  card: {

  }
});

class Properties extends BaseContainer {
  constructor(props) {
    super(props, PropertiesController);
  }

  state = { center: null };

  componentWillMount() {
    this.controller.fetch();
  }

  _renderCards() {
    const { properties, self, history, openModalAction } = this.props;
    const { handleDeleteProperty } = this.controller;

    if(!properties) return <div>loading...</div>;
    if(!properties.all.length) return <div>No properties found.</div>;

    return properties.all.map(property => (
      <PropertyCard
        key={property.id}
        property={property}
        isEditable={self && self.role !== 'client'}
        clickAction={() => {
          this.setState({ center: property.coords });
          setTimeout(() => {
            this.setState({ center: null });
          }, 1500);
        }}
        editAction={() => history.push(`/properties/${property.id}/edit`)}
        deleteAction={() => openModalAction({
          description: `Are you sure you want to delete '${property.name}?'`,
          buttonFn: () => handleDeleteProperty(property.id)
        })}
      />
    ));
  }



  render() {
    const { center } = this.state;
    const { classes, history, self, properties } = this.props;
    
    return (
      <div className={classes.wrapper}>
        <div className='list'>
          <div className='head'>
            <h1>Properties</h1>
            {
              self && self.role !== 'client' &&
              <Button
                id='create'
                onClick={() => history.push('/properties/new')}
              >
                + Create
              </Button>
            }
          </div>
          <div className='filters'>
            <PropertyFilters setPropertiesAction={setPropertiesAction} />
          </div>
          <div className='body'>
            {this._renderCards()}
          </div>
        </div>
        <div className='map'>
          <MapComponent
            center={center}
            properties={properties ? properties.all : []}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  self: state.users.self,
  properties: state.properties.model
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, actions)
)(Properties);