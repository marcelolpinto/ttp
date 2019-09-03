import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField } from '@material-ui/core';
import compose from 'recompose/compose';
import { BaseContainer } from '../../helpers';
import { showLoadingAction, closeLoadingAction } from '../../store/actions';
import { CreateUserController } from './CreateUser.controller';

const actions = { showLoadingAction, closeLoadingAction };

const styles = theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray.bg,
    height: '100vh',
    '& > div': {
      maxHeight: 'calc(100% - 32px)',
      '& > h1': {
        marginBottom: 2 * theme.unit,
        textAlign: 'center'
      },
      '& > form': {
        padding: 2 * theme.unit,
        backgroundColor: 'white',
        borderRadius: theme.unit,
        textAlign: 'center',
        '& .text-input': {
          display: 'block',
          width: 320,
          '& + .text-input': {
            marginTop: 2 * theme.unit
          },
          '& > div': {
            width: '100%'
          }
        },
        '& > button': {
          marginTop: 2 * theme.unit,
          display: 'inline-block',
          '&#save': theme.buttons.primary,
        }
      }
    }
  }
});

class CreateUser extends BaseContainer {
  constructor(props) {
    super(props, CreateUserController);
  }
  
  state = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',

    errors: {}
  }

  render() {
    const { errors } = this.state;
    const { classes, history } = this.props;
    const { handleChange, handleSubmit } = this.controller;

    return (
      <div className={classes.wrapper}>
        <div>
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
            <Button type='submit' id='save' onClick={handleSubmit}>Create User</Button><br/>
            <Button id='back' onClick={() => history.push('/')}>back to login</Button>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, actions)
)(CreateUser);