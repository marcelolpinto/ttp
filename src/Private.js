import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Header } from './components';
import { BaseContainer } from './helpers';
import { PrivateController } from './Private.controller';
import {
  setSelfAction,
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  clearAction
} from './store/actions';

const actions = {
  setSelfAction,
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  clearAction
};

class Private extends BaseContainer {
  constructor(props) {
    super(props, PrivateController);
  }

  componentDidMount() {
    this.controller.init();
  }

	render() {
		return (
      <div>
        <Header
          homeClick={this.controller.homeClick}
          logout={this.controller.logout}
          self={this.props.self} />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  self: state.users.self
});

export default compose(
	connect(mapStateToProps, actions),
  withRouter
)(Private);
