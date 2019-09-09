import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField, Avatar } from '@material-ui/core';
import compose from 'recompose/compose';

import {
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  setSelfAction,
  clearHeaderImageAction,
  restoreHeaderImageAction,
} from '../../store/actions';
import { BaseContainer } from '../../helpers';
import "react-datepicker/dist/react-datepicker.css";
import { SettingsController } from './Settings.controller';
import { NO_IMAGE_URL } from '../../constants';

const actions = {
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  setSelfAction,
  clearHeaderImageAction,
  restoreHeaderImageAction,
};

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
    '& > div.avatar': {
      cursor: 'pointer',
      willChange: 'transform',
      transition: 'transform .3s, box-shadow .3s',
      marginTop: 2 * theme.unit,
      height: 72,
      width: 72,
      marginBottom: 2 * theme.unit,
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: theme.shadows[1]
      }
    },
    '& > form': {
      marginTop: 2 * theme.unit,
      '& .text-input + .text-input': {
        marginLeft: theme.unit
      },
      '& div.-error': {
        '& label': {
          color: theme.colors.red.main,
          '&.error': {
            display: 'block',
            transform: 'translateY(12px)',
            marginLeft: 12,
            fontSize: theme.fontSizes.XS
          }
        },
        '& .react-datepicker-wrapper:after': {
          position: 'absolute',
          content: '""',
          bottom: -6,
          left: 0,
          height: 2,
          width: '100%',
          backgroundColor: theme.colors.red.main
        }
      },
      '& > button#save-settings, & > button#change-password': {
        ...theme.buttons.primary,
        display: 'inline-block',
        marginTop: 2 * theme.unit
      },
      '& > button#back': {
        ...theme.buttons.secondary,
        display: 'inline-block',
        marginTop: 2 * theme.unit,
        marginLeft: 2 * theme.unit
      }
    }
  }
});

class Settings extends BaseContainer {
  constructor(props) {
    super(props, SettingsController);
  }

  componentWillMount() {
    const { self } = this.props;
    if(self) this.setState({
      name: self.name,
      email: self.email,
      imageUrl: self.imageUrl
    });
  }

  componentWillReceiveProps(nextProps) {
    const { self } = nextProps;
    if(self && !this.props.self) {
      this.setState({
        name: self.name,
        email: self.email,
        imageUrl: self.imageUrl
      });
    }
  }

  state = {
    name: '',
    email: '',
    old_password: '',
    password: '',
    confirm_password: '',

    errors: {}
  }

  render() {
    const { classes, history } = this.props;
    const { errors } = this.state;
    const { handleChange, handleSubmit, handleChangePassword, handleUpload } = this.controller;

    return (
      <div className={classes.wrapper}>
        <h1>Settings</h1>
        <h3 style={{ marginTop: '16px' }}>Your profile</h3>
        <input
          type='file'
          id='file-upload'
          accept="image/*" 
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <Avatar
          className='avatar'
          onClick={() => document.querySelector('#file-upload').click()}
          src={this.state.imageUrl || NO_IMAGE_URL}
        />
        <form onSubmit={handleSubmit}>
          <TextField
            error={!!errors.name}
            helperText={errors.name}
            id='name'
            label='Name'
            className='text-input'
            value={this.state.name}
            onChange={handleChange}
          />
          <TextField
            error={!!errors.email}
            helperText={errors.email}
            id='email'
            label='E-mail'
            className='text-input'
            value={this.state.email}
            onChange={handleChange}
          />
          <br/>
          <Button
            type='submit'
            id='save-settings'
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </form>
        <h3 style={{ marginTop: 32 }}>Change your password</h3>
        <form>
          <TextField
            error={!!errors.old_password}
            helperText={errors.old_password}
            id='old_password'
            label='Current Password'
            className='text-input'
            type='password'
            value={this.state.old_password}
            onChange={handleChange}
          />
          <TextField
            error={!!errors.password}
            helperText={errors.password}
            id='password'
            label='New Password'
            className='text-input'
            type='password'
            value={this.state.password}
            onChange={handleChange}
          />
          <TextField
            error={!!errors.confirm_password}
            helperText={errors.confirm_password}
            id='confirm_password'
            label='Confirm New Password'
            className='text-input'
            type='password'
            value={this.state.confirm_password}
            onChange={handleChange}
          />
          <br/>
          <Button
            type='submit'
            id='change-password'
            className='primary'
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
          <Button id='back' onClick={history.goBack}>
            Back
          </Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users.model,
  self: state.users.self
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, actions)
)(Settings);