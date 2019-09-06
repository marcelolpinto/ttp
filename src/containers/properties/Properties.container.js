import React from 'react'
import { connect } from 'react-redux';
import { withStyles, Button, Icon } from '@material-ui/core';
import compose from 'recompose/compose';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

import { BaseContainer } from '../../helpers';
import { PropertiesController } from './Properties.controller';
import {
  showLoadingAction,
  closeLoadingAction,
} from '../../store/actions';
import { MapComponent } from '../../components/_lib/Map.component';

const actions = {
  showLoadingAction,
  closeLoadingAction,
};

const MIN_LIST_WIDTH = '360px';

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
        display: 'flex',
        justifyContent: 'space-between',
        '& > button': theme.buttons.primary
      },
      '& > div.body': {
        marginTop: 2 * theme.unit,
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
  }
});

class Properties extends BaseContainer {
  constructor(props) {
    super(props, PropertiesController);
  }

  state = {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { classes, history, selectedUser, self, match } = this.props;
    
    return (
      <div className={classes.wrapper}>
        <div className='list'>
          <div className='head'>
            <h1>Properties</h1>
            <Button
              id='create-property'
              onClick={() => history.push('/create-property')}
            >
              Create
            </Button>
          </div>
          <div className='body'>
            Body
          </div>
        </div>
        <div className='map'>
          <MapComponent properties={[{ id: 1 }]} />
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