import React from 'react'
import { connect } from 'react-redux';
import {
  withStyles,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import compose from 'recompose/compose';
 
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
      },
      '& form': {
        '& > *': {
          marginTop: 2 * theme.unit,
        },
        '& > h3': {
          marginTop: 4 * theme.unit
        },
        '& button#submit': {
          marginTop: 4 * theme.unit,
          ...theme.buttons.primary,
          width: '100%',
          fontSize: theme.fontSizes.LG
        },
        '& button#back': {
          marginTop: 2 * theme.unit,
          ...theme.buttons.secondary,
          width: '100%',
          fontSize: theme.fontSizes.LG
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
    },
    
  }
});

class CreateProperty extends BaseContainer {
  constructor(props) {
    super(props, CreatePropertyController);
  }

  state = {
    realtorId: '',
    name: '',
    description: '',
    address: '',
    lat: '',
    lng: '',
    bedrooms: '',
    area: '',
    price: '',
    placeId: '',

    editLat: '',
    editLng: '',

    errors: {}
  }


  
  render() {
    const { errors, lat, lng } = this.state;
    const { classes, history, self, users } = this.props;
    const {
      handleSelect,
      handleSelectAddress,
      handleChange,
      handleSubmit,
      handleSetCoordinates,
    } = this.controller;

    const creating = lat && lng ? { lat, lng } : null;
    
    return (
      <div className={classes.wrapper}>
        <div className='list'>
          <h1>Create Property</h1>
          <form>
            {/* todo: select realtor input */}
            {
              users && self && self.role === 'admin' &&
              <FormControl>
                <InputLabel htmlFor="realtorId">Realtor</InputLabel>
                <Select
                  error={!!errors.realtorId}
                  style={{ width: 200 }}
                  value={this.state.realtorId}
                  onChange={handleSelect}
                  inputProps={{
                    name: 'realtorId',
                    id: 'realtorId',
                  }}
                >
                  {users.realtorsToSelect.map(({ value, label }) => (
                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {label}{value === self.id ? ' (me)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            }
            <TextField
              required
              error={!!errors.name}
              helperText={errors.name}
              id='name'
              label='Name'
              className='text-input'
              value={this.state.name}
              onChange={handleChange}
            />
            <TextField
              multiline
              required
              error={!!errors.description}
              helperText={errors.description}
              id='description'
              label='Description'
              className='text-input'
              value={this.state.description}
              onChange={handleChange}
            />
            <LocationSearchInput
              value={this.state.address}
              handleSelect={handleSelectAddress}
              handleChange={address => this.setState({ address })}
            />
            <TextField
              required
              error={!!errors.bedrooms}
              helperText={errors.bedrooms}
              id='bedrooms'
              label='Number of Bedrooms'
              className='text-input'
              value={this.state.bedrooms}
              onChange={e => handleChange(e, 'number')}
            />
            <TextField
              required
              error={!!errors.area}
              helperText={errors.area}
              id='area'
              label='Floor area (sqm)'
              className='text-input'
              value={this.state.area}
              onChange={e => handleChange(e, 'numberWithCommas')}
            />
            <TextField
              required
              error={!!errors.price}
              helperText={errors.price}
              id='price'
              label='Price (U$)'
              className='text-input'
              value={this.state.price}
              onChange={e => handleChange(e, 'numberWithCommas')}
            />
            <h3>Coordinates</h3>
            <TextField
              required
              error={!!errors.editLat}
              helperText={errors.editLat}
              id='editLat'
              label='Latitude'
              className='text-input'
              value={this.state.editLat}
              onChange={e => handleChange(e, 'numberAllowDots')}
            />
            <br/>
            <TextField
              required
              error={!!errors.editLng}
              helperText={errors.editLng}
              id='editLng'
              label='Longitude'
              className='text-input'
              value={this.state.editLng}
              onChange={e => handleChange(e, 'numberAllowDots')}
            />
            <br/>
            <Button id='set-coordinates' onClick={handleSetCoordinates}>
              Set coordinates
            </Button>
            <br/>
            <Button onClick={handleSubmit} id='submit'>
              Save
            </Button>
            <br/>
            <Button onClick={() => history.push('/properties')} id='back'>
              Back
            </Button>
          </form>
        </div>
        <div className='map'>
          <MapComponent creating={creating} zoom={creating && 15} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  self: state.users.self,
  users: state.users.model
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, actions)
)(CreateProperty);