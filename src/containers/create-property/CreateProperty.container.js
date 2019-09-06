import React from 'react'
import { connect } from 'react-redux';
import { withStyles, Button, Icon, TextField } from '@material-ui/core';
import compose from 'recompose/compose';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
 
import { BaseContainer } from '../../helpers';
import { CreatePropertyController } from './CreateProperty.controller';
import {
  showLoadingAction,
  closeLoadingAction,
} from '../../store/actions';
import { MapComponent } from '../../components/_lib/Map.component';
import { LocationSearchInput } from '../../components';

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
        justifyContent: 'space-between'
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

class CreateProperty extends BaseContainer {
  constructor(props) {
    super(props, CreatePropertyController);
  }

  state = {
    address: ''
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { classes, history, selectedUser, self, match } = this.props;
    const { handleAutocomplete } = this.controller;
    
    return (
      <div className={classes.wrapper}>
        <div className='list'>
          <h1>Create Property</h1>
          <form>
            <LocationSearchInput />
          </form>
        </div>
        <div className='map'>
          <MapComponent properties={[]} zoom={12} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  self: state.users.self,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, actions)
)(CreateProperty);