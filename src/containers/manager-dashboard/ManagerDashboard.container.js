import React from 'react'
import { connect } from 'react-redux';
import { withStyles, Button, Icon } from '@material-ui/core';
import compose from 'recompose/compose';
import { toast } from 'react-toastify';

import { BaseContainer } from '../../helpers';
import { ManagerDashboardController } from './ManagerDashboard.controller';
import {
  closeModalAction,
  openModalAction,
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  selectUserAction
} from '../../store/actions';
import { userTableHead } from '../../assets/tables.assets';
import UserNotAllowed from '../../UserNotAllowed';

const actions = {
  closeModalAction,
  openModalAction,
  setUsersAction,
  showLoadingAction,
  closeLoadingAction,
  selectUserAction
};

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
    '& > section.top': {
      display: 'flex',
      justifyContent: 'space-between',
      '& > h1': {
        fontSize: theme.fontSizes.XL
      },
      '& > button': theme.buttons.primary
    },
    '& > section > table': {
      borderCollapse: 'separate',
      borderSpacing: '0 8px',
      width: '100%',
      '& thead': {
        borderBottom: 'none',
        '& th': {
          color: theme.colors.gray.main,
          fontSize: theme.fontSizes.SM,
          padding: theme.unit,
          paddingBottom: 0,
          userSelect: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          '& > *': { verticalAlign: 'middle' },
          '&.selected': { color: theme.colors.blue.main }
        }
      },
      '& tbody tr': {
        boxShadow: theme.shadows[2],
        border: `solid 1px ${theme.colors.gray.border}`,
        height: 56,
        '&.pointer': { cursor: 'pointer' },
        '& td': {
          backgroundColor: 'white',
          padding: theme.unit,
          fontSize: theme.fontSizes.SM,
          position: 'relative',
          color: theme.colors.black.main
        },
        '& .material-icons': { cursor: 'pointer' },
        '&.gray td': {
          backgroundColor: theme.colors.gray.light
        },
      }
    }
  }
});

class ManagerDashboard extends BaseContainer {
  constructor(props) {
    super(props, ManagerDashboardController);
  }

  state = {
    toTable: [],
    sort: '-date',
    filters: {
      dateFrom: null,
      dateTo: null,
      timeFrom: null,
      timeTo: null
    }
  }

  componentDidMount() {
    if(this.props.users) {
      const all = this.props.self.role === 'admin' ? 'all' : 'allUsers';
      this.setState({ toTable: this.props.users[all] });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { users } = nextProps, prevUsers = this.props.users;
    if(users && !prevUsers) {
      const all = nextProps.self.role === 'admin' ? 'all' : 'allUsers';
      this.setState({ toTable: nextProps.users[all] });
    }
  }

  _renderTable() {
    const { toTable, sort } = this.state;
    const { handleSort, handleDeleteUser, handleViewUser } = this.controller;
    const { users, self, openModalAction, history } = this.props;

    if(!users || !self) return <div>loading...</div>;

    if(!users.all.length) return <div>You don't have any registered users.</div>

    return (
      <table>
        <thead>
          <tr>
            {userTableHead.map(({ id, label }) => {
              return (
                <th
                  key={id}
                  className={sort.endsWith(id) ? 'selected' : ''}
                  onClick={() => handleSort(id)}
                >
                  {label}
                  <Icon>{sort !== id ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</Icon>
                </th>
              )
            })}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {toTable.map(({ id, name, max_calories, email, role }) => {

            const shouldEdit = self.role === 'admin' || (self.role === 'manager' && role !== 'admin');
            const shouldRedirect = self.role === 'admin' && role === 'user';

            return (
              <tr
                key={id}
                className={shouldRedirect ? 'pointer' : ''}
                onClick={e => shouldRedirect ? handleViewUser(e, id) : null}
              >
                <td>{name}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>{role === 'user' ? max_calories : null}</td>
                <td>
                  {shouldEdit ? <Icon onClick={e => {
                    e.stopPropagation();
                    if(id === self.id) return toast('Go to the Settings Menu if you want to edit your profile.');
                    history.push(`/users/${id}/edit`);
                  }}>
                    edit
                  </Icon> : null}
                </td>
                <td>
                  {shouldEdit ? <Icon onClick={e => {
                    e.stopPropagation();
                    openModalAction({
                      description: self.id === id ?
                        'Are you sure you want to delete your profile? You will be disconnected.' 
                        : `Are you sure you want to delete ${name}?`,
                      buttonFn: () => handleDeleteUser(id)
                    });
                  }}> delete </Icon> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  
  render() {
    const { classes, history } = this.props;

    return (
      <UserNotAllowed>
        <div className={classes.wrapper}>
          <section className='top'>
            <h1>Users</h1>
            <Button id='add-user' onClick={() => history.push('/users/new')}>Add user</Button>
          </section>
          <section>
            {this._renderTable()}
          </section>
        </div>
      </UserNotAllowed>
    );
  }
}

const mapStateToProps = state => ({
  self: state.users.self,
  users: state.users.model
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, actions)
)(ManagerDashboard);