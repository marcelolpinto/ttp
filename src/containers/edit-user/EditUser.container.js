import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField, FormControl, InputLabel, Select, MenuItem, Avatar } from '@material-ui/core';
import compose from 'recompose/compose';

import { setUsersAction, showLoadingAction, closeLoadingAction } from '../../store/actions';
import { BaseContainer } from '../../helpers';
import "react-datepicker/dist/react-datepicker.css";
import { EditUserController } from './EditUser.controller';
import UserNotAllowed from '../../UserNotAllowed';

const NO_IMAGE_URL = 'https://cdn4.iconfinder.com/data/icons/eldorado-user/40/user-128.png';

const actions = { setUsersAction, showLoadingAction, closeLoadingAction };

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
    '& > h1': {
      marginBottom: 2 * theme.unit
    },
    '& > div.avatar': {
      cursor: 'pointer',
      willChange: 'transform',
      transition: 'transform .3s, box-shadow .3s',
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
      '& .text-input': {
        marginBottom: 2 * theme.unit,
        '&  + .text-input': {
          marginLeft: theme.unit
        }
      },
      '& .react-datepicker-wrapper': {
        marginLeft: theme.unit,
        position: 'relative',
        '& input': {
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          '&:focus': { outline: 'none' }
        },
        '&:after': {
          position: 'absolute',
          content: '""',
          bottom: -6,
          left: 0,
          height: 1,
          width: '100%',
          backgroundColor: 'rgba(0,0,0,.42)'
        }
      },
      '& > button.primary': {
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

class EditUser extends BaseContainer {
  constructor(props) {
    super(props, EditUserController);
  }

  state = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
    imageUrl: '',
    
    errors: {}
  }

  componentDidMount() {
    const { history, users, match: { params: { userId }}} = this.props;

    if(!userId) return history.push('/users');

    if(users) {
      const user = users.getById(userId);
      if(!user) return history.push('/users');

      this.setState({
        user,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history, users, match: { params: { userId }}} = nextProps;

    if(users && !this.props.users) {
      const user = users.getById(userId);
      if(!user) return history.push('/users');

      this.setState({
        user,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl
      });
    }
  }

  render() {
    const { classes, history, self } = this.props;
    const { errors } = this.state;
    const { handleChange, handleSubmit, handleUpload, handleSelect, handleChangePassword } = this.controller;

    return (
      <UserNotAllowed>
        <div className={classes.wrapper}>

          <h1>Edit User</h1>

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
            <FormControl>
              <InputLabel htmlFor="role">Role</InputLabel>
              <Select
                style={{ width: 204, marginRight: 8 }}
                value={this.state.role}
                onChange={handleSelect}
                inputProps={{
                  name: 'role',
                  id: 'role',
                }}
              >
                <MenuItem value='client'>Client</MenuItem>
                <MenuItem value='realtor'>Realtor</MenuItem>
                {self && self.role === 'admin' ? <MenuItem value='admin'>Admin</MenuItem> : null}
              </Select>
            </FormControl>
            <br/>
            <Button
              type='submit'
              id='edit-user'
              className='primary'
              onClick={handleSubmit}
            >
              Save
            </Button>
          </form>
          <h3 style={{ marginTop: 32 }}>Change this user's password</h3>
          <form>
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
            <Button id='back' onClick={() => history.push('/users')}>
              Back
            </Button>
          </form>
        </div>
      </UserNotAllowed>
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
)(EditUser);