import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';

class ManagerNotAllowed extends Component {
  componentWillMount() {
    const { self, history } = this.props;
    if(self && self.role === 'manager')
      return history.push('/users');
  }
    
  componentWillReceiveProps(nextProps) {
    const { self, history } = nextProps;
    if(self && !this.props.self && self.role === 'manager') 
      return history.push('/users');
  }

	render() {
		return this.props.children;
  }
}

const mapStateToProps = state => ({
  self: state.users.self
});

export default compose(
	connect(mapStateToProps, null),
  withRouter
)(ManagerNotAllowed);
