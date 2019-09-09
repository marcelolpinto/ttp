import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField } from '@material-ui/core';
import queryString from 'query-string';
import compose from 'recompose/compose';

import { BaseContainer } from '../../helpers';
import { showLoadingAction, closeLoadingAction, setSelfAction } from '../../store/actions';
import { CompleteUserController } from './CompleteUser.controller';

const actions = { showLoadingAction, closeLoadingAction, setSelfAction };

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

class CompleteUser extends BaseContainer {
  constructor(props) {
    super(props, CompleteUserController);

    this.query = queryString.parse(props.location.search);

    if(!this.query.email || !this.query.token || !this.query.user_id) {
      console.error('Missing parameters in URL.');
      props.history.push('/');
    }

    this.state = {
      name: '',
      email: this.query.email,
      password: '',
      confirm_password: '',
  
      errors: {},
      
      query: this.query
    }
  }

  componentWillMount() {
    this.controller.initialValidation();
  }

  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    const { handleChange, handleSubmit } = this.controller;

    return (
      <div className={classes.wrapper}>
        <div>
          <h1>Complete your profile</h1>
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
              disabled
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
            <Button type='submit' id='save' onClick={handleSubmit}>Complete</Button>
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
)(CompleteUser);