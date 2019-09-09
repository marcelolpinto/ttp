import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core';
import compose from 'recompose/compose';
import { showLoadingAction, closeLoadingAction } from '../../store/actions';
import { UsersRepository } from '../../repositories';
import queryString from 'query-string';

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
      '& > p': {
        marginBottom: 2 * theme.unit,
        fontSize: theme.fontSizes.MD,
        textAlign: 'center'
      },
    }
  }
});

class ValidateUser extends Component {
  async componentDidMount() {
    const queryObj = queryString.parse(this.props.location.search);
    const { token, user_id } = queryObj; 
    if(!token || !user_id) {
      return this.props.history.push('/');
    }
    
    const repo = new UsersRepository();
    const validation = await repo.validate(user_id, token);
    
    if(validation.err) {
      return this.props.history.push('/');
    }

    else {
      const updatedUser = await repo.update(user_id, { status: 'active' }, token);
      if(!updatedUser.err) {
        window.localStorage.setItem('token', token);        
        window.localStorage.setItem('user_id', user_id);        
        this.props.history.push('/properties');
      }
    }
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <div>
          <p>Validating...</p>
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
)(ValidateUser);