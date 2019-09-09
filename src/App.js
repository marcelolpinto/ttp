import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles';
import compose from 'recompose/compose';
import { ToastContainer } from 'react-toastify';
import { css } from 'glamor';

import theme from './muiTheme';
import 'react-toastify/dist/ReactToastify.min.css';

import Private from './Private';
import { Login } from './containers/login';
import { CreateUser } from './containers/create-user';
import { CreateProperty } from './containers/create-property';
import { CompleteUser } from './containers/complete-user';
import { EditUser } from './containers/edit-user';
import { EditProperty } from './containers/edit-property';
import { InviteUser } from './containers/invite-user';
import { Users } from './containers/users';
import { AdminCreateUser } from './containers/admin-create-user';
import { Settings } from './containers/settings';
import { Properties } from './containers/properties';
import { ValidateUser } from './containers/validate-user';
import { Modal, Loading } from './components';
import { NotFound } from './NotFound';

import { closeModalAction } from './store/actions';
const actions = { closeModalAction };

const styles = theme => ({
  app: {
    padding: 0,
    margin: 0,
    userSelect: 'none',
    overflowX: 'hidden',
    '& *': {
      userSelect: 'none'
    }
  }
});

class App extends Component {

	render() {
    const { classes, closeModalAction , modal, showLoading } = this.props;

		return (
      <MuiThemeProvider theme={theme}>
        <ToastContainer progressClassName={css({
          background: '#303F9F !important'
        })} />
        <div className={classes.app}>
          {showLoading && <Loading />}
          <Modal {...modal} handleClose={closeModalAction} />
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/new-user' component={CreateUser} />
            <Route exact path='/complete-user' component={CompleteUser} />
            <Route exact path='/validate' component={ValidateUser} />
            <Private>
              <Switch>
                <Route exact path='/settings' component={Settings} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/users/new' component={AdminCreateUser} />
                <Route exact path='/users/:userId/edit' component={EditUser} />
                <Route exact path='/invite' component={InviteUser} />

                <Route exact path='/properties' component={Properties} />
                <Route exact path='/properties/new' component={CreateProperty} />
                <Route exact path='/properties/:propertyId/edit' component={EditProperty} />

                <Route path='/*' component={NotFound} />
              </Switch>
            </Private>
            <Route path='/*' component={NotFound} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal,
  showLoading: state.loading.show
});

export default compose(
  withStyles(styles),
	connect(
    mapStateToProps,
		actions
  ),
  withRouter
)(App);
