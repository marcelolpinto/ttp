import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import compose from 'recompose/compose';

import { setUsersAction, showLoadingAction, closeLoadingAction } from '../../store/actions';
import { BaseContainer } from '../../helpers';
import "react-datepicker/dist/react-datepicker.css";
import { ManagerCreateUserController } from './ManagerCreateUser.controller';
import UserNotAllowed from '../../UserNotAllowed';

const actions = { setUsersAction, showLoadingAction, closeLoadingAction };

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
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
      '& > button#create-user': {
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

class ManagerCreateUser extends BaseContainer {
  constructor(props) {
    super(props, ManagerCreateUserController);
  }

  state = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    max_calories: '',
    role: 'user',
    
    errors: {}
  }

  render() {
    const { classes, history, self } = this.props;
    const { errors } = this.state;
    const { handleChange, handleSubmit, handleSelect } = this.controller;

    return (
      <UserNotAllowed>
        <div className={classes.wrapper}>
          <h1>New User</h1>
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
            {this.state.role === 'user' && <TextField
              error={!!errors.max_calories}
              helperText={errors.max_calories}
              id='max_calories'
              label='Expected calories/day'
              className='text-input'
              value={this.state.max_calories}
              onChange={e => handleChange(e, 'number')}
            />}
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
                <MenuItem value='user'>User</MenuItem>
                {self && self.role === 'admin' ? <MenuItem value='manager'>Manager</MenuItem> : null}
                {self && self.role === 'admin' ? <MenuItem value='admin'>Admin</MenuItem> : null}
              </Select>
            </FormControl>
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              id='password'
              label='Password'
              className='text-input'
              type='password'
              value={this.state.password}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
              id='confirm_password'
              label='Confirm Password'
              className='text-input'
              type='password'
              value={this.state.confirm_password}
              onChange={handleChange}
            />
            <br/>
            <Button
              type='submit'
              id='create-user'
              onClick={handleSubmit}
            >
              Save
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
)(ManagerCreateUser);