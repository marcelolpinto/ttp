import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField } from '@material-ui/core';
import compose from 'recompose/compose';
import { BaseContainer } from '../../helpers';
import { LoginController } from './Login.controller';
import { showLoadingAction, closeLoadingAction } from '../../store/actions';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

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
          '&#login': theme.buttons.primary,
        }
      }
    }
  }
});

class Login extends BaseContainer {
  constructor(props) {
    super(props, LoginController);
  }

  state = {
    email: '',
    password: '',

    errors: {}
  }

  render() {
    const { classes, history } = this.props;
    const { errors } = this.state;
    const { handleChange, handleSubmit, handleGoogleSignIn, handleFacebookSignIn } = this.controller;

    return (
      <div className={classes.wrapper}>
        <div>
          <h1>TTP Properties</h1>
          <form onSubmit={handleSubmit}>
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
            <Button type='submit' id='login' onClick={handleSubmit}>Login</Button>
            <br/>
            <Button id='new-user' onClick={() => history.push('new-user')}>
              or create a new user
            </Button>
            <br/>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Sign In or Login"
              onSuccess={handleGoogleSignIn}
              onFailure={res => console.error('google login failure:', res)}
              cookiePolicy='single_host_origin'
            />
            <br/>
            <br/>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              fields="name,email,picture"
              callback={handleFacebookSignIn} />
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({});

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, actions)
)(Login);