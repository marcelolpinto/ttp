import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';

class UserNotAllowed extends Component {
  componentDidMount() {
    const { self, history } = this.props;
    if(self && self.role === 'user')
      return history.push(`/dashboard/${self.id}`);
  }
    
  componentWillReceiveProps(nextProps) {
    const { self, history } = nextProps;
    if(self && !this.props.self && self.role === 'user') 
      return history.push(`/dashboard/${self.id}`);
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
)(UserNotAllowed);
