import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import compose from 'recompose/compose';

import { showLoadingAction, closeLoadingAction, setUsersAction } from '../../store/actions';
import { BaseContainer } from '../../helpers';
import { InviteUserController } from './InviteUser.controller';
import UserNotAllowed from '../../UserNotAllowed';

const actions = { showLoadingAction, closeLoadingAction, setUsersAction };

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
    '& > h1': {
      marginBottom: 2 * theme.unit
    },
    '& > form': {
      marginTop: 2 * theme.unit,
      '& .text-input': {
        marginBottom: 2 * theme.unit,
        '&  + .text-input': {
          marginLeft: theme.unit
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

class InviteUser extends BaseContainer {
  constructor(props) {
    super(props, InviteUserController);
  }

  state = {
    email: '',
    role: 'client',

    errors: {}
  }

  componentDidMount() {
  }

  render() {
    const { email, role, errors } = this.state;
    const { classes, history } = this.props;
    const { handleSubmit } = this.controller;

    return (
      <UserNotAllowed>
        <div className={classes.wrapper}>

          <h1>Invite User</h1>
          <p>Invite an user to the platform through his/her email.</p>

          <form onSubmit={handleSubmit}>
            <TextField
              error={!!errors.email}
              helperText={errors.email}
              id='email'
              label='E-mail'
              className='text-input'
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
            />
            <FormControl style={{ marginLeft: '16px' }}>
              <InputLabel htmlFor="role">Role</InputLabel>
              <Select
                style={{ width: 204 }}
                value={role}
                onChange={e => this.setState({ role: e.target.value })}
                inputProps={{
                  name: 'role',
                  id: 'role',
                }}
              >
                <MenuItem value='client'>Client</MenuItem>
                <MenuItem value='realtor'>Realtor</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
              </Select>
            </FormControl>
            <br/>
            <Button
              type='submit'
              id='invite-user'
              className='primary'
              onClick={handleSubmit}
            >
              Send Invitation
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
  users: state.users.model
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, actions)
)(InviteUser);