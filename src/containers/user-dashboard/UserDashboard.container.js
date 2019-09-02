import React from 'react'
import { connect } from 'react-redux';
import { withStyles, Button, Icon } from '@material-ui/core';
import compose from 'recompose/compose';
import DatePicker from 'react-datepicker'

import { BaseContainer } from '../../helpers';
import { UserDashboardController, defaultFilters } from './UserDashboard.controller';
import {
  closeModalAction,
  openModalAction,
  setMealsAction,
  showLoadingAction,
  closeLoadingAction,
  selectUserAction,
  setUserMealsAction
} from '../../store/actions';
import ManagerNotAllowed from '../../ManagerNotAllowed';
import { mealsTableHead } from '../../assets/tables.assets';

const actions = {
  closeModalAction,
  openModalAction,
  setMealsAction,
  showLoadingAction,
  closeLoadingAction,
  selectUserAction,
  setUserMealsAction
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
      '& button#add-meal': theme.buttons.primary,
      '& button#back': theme.buttons.secondary,
      '& button': {
        display: 'inline-block',
        marginLeft: 2 * theme.unit
      }
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
        '& .material-icons': {
          cursor: 'pointer'
        },
        '& td': {
          backgroundColor: 'white',
          padding: theme.unit,
          fontSize: theme.fontSizes.SM,
          position: 'relative',
          color: theme.colors.black.main,
          '&.green': {
            fontWeight: 700,
            color: theme.colors.green.main
          },
          '&.red': {
            fontWeight: 700,
            color: theme.colors.red.main
          }
        },
        '&.gray td': {
          backgroundColor: theme.colors.gray.light
        },
      }
    },
    '& > section > div.filters': {
      marginTop: '12px',
      marginBottom: '24px',
      '& > h3': {
        marginBottom: '16px',
      },
      '& .react-datepicker-wrapper': {
        marginRight: theme.unit,
        position: 'relative',
        '& input': {
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          '&:focus': { outline: 'none' }
        },
        '&:after': {
          position: 'absolute',
          content: '""',
          bottom: -6,
          left: 0,
          height: 1,
          width: '100%',
          backgroundColor: 'rgba(0,0,0,.42)'
        }
      },
      '& > div': {
        display: 'inline-block',
        '& > label': {
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          marginLeft: '8px'
        }
      },
      '& button': {
        ...theme.buttons.secondary,
        fontSize: theme.fontSizes.XSM
      }
    }
  }
});

class UserDashboard extends BaseContainer {
  constructor(props) {
    super(props, UserDashboardController);
  }

  state = {
    toTable: [],
    sort: '-date',
    filters: defaultFilters,
    fetching: false
  }

  componentDidMount() {
    const { meals, selectedUser, userMeals, self, setMealsAction } = this.props;
    if(meals) {
      const toTable = this.controller.handleToTable(meals.all);
      this.setState({ toTable });
    }
    if(self && self.role === 'admin' && selectedUser) {
      if(userMeals && userMeals.getById(selectedUser.id)) {
        const m = userMeals.getById(selectedUser.id).meals;
        setMealsAction(m);

        const toTable = this.controller.handleToTable(m.all);
        this.setState({ toTable });
      } else {
        this.controller.adminFetchAndSetMeals(selectedUser.id);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { self, meals, selectedUser, match, users, selectUserAction, userMeals } = nextProps,
      prevMeals = this.props.meals;

    if(meals && !prevMeals) {
      const toTable = this.controller.handleToTable(meals.all);
      this.setState({ toTable });
    }

    if(self && self.role === 'admin') {
      if(!selectedUser && match.params.userId && users) {
        selectUserAction(users.getById(match.params.userId));
      }
      if(selectedUser) {
        if(userMeals && userMeals.getById(selectedUser.id)) {
          const m = userMeals.getById(selectedUser.id).meals;
          setMealsAction(m);

          const toTable = this.controller.handleToTable(m.all);
          this.setState({ toTable });
        } else if(!this.state.fetching) {
          this.controller.adminFetchAndSetMeals(selectedUser.id);
        }
      }
    }
  }

  _renderFilters() {
    const { meals } = this.props;
    const { dateFrom, dateTo, timeFrom, timeTo } = this.state.filters;
    const { handleChangeFilter, handleClearFilters } = this.controller;

    if(!meals || !meals.all.length) return null;

    return (
      <div className='filters'>
        <h3>Filters</h3>
        <div>
          <label>Date From</label>
          <DatePicker
            selected={dateFrom}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            onChange={d => handleChangeFilter(d, 'dateFrom')}
          />
        </div>
        <div>
          <label>Date To</label>
          <DatePicker
            selected={dateTo}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            onChange={d => handleChangeFilter(d, 'dateTo')}
            minDate={dateFrom}
          />
        </div>
        <div>
          <label>Time From</label>
          <DatePicker
            selected={timeFrom}
            onChange={d => handleChangeFilter(d, 'timeFrom')}
            timeIntervals={15}
            showTimeSelect
            showTimeSelectOnly
            dateFormat="hh:mm a"
            timeCaption="Time From"
          />
        </div>
        <div>
          <label>Time To</label>
          <DatePicker
            selected={timeTo}
            onChange={d => handleChangeFilter(d, 'timeTo')}
            timeIntervals={15}
            showTimeSelect
            showTimeSelectOnly
            dateFormat="hh:mm a"
            timeCaption="Time To"
          />
        </div>
        <div>
          <Button
            id='clear-filters'
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>  
      </div>
    );
  }
  
  _renderTable() {
    const { toTable, sort } = this.state;
    const { handleSort, handleDeleteMeal } = this.controller;
    const { meals, self, openModalAction, history, match, selectedUser } = this.props;

    if(!meals || !self) return <div>loading...</div>;

    if(!meals.all.length) return <div>No registered meals.</div>

    return (
      <table>
        <thead>
          <tr>
          {mealsTableHead.map(({ id, label }) => {
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
          {toTable.map(({ id, name, calories, tableDay, tableTime, day }) => {

            const maxCalories = selectedUser ? selectedUser.max_calories : self.max_calories;

            let rowClassName = '';
            if(Object.keys(meals.caloriesByDay).indexOf(day)%2) rowClassName = 'gray';
            
            let caloriesClassName = 'green';
            if(meals.caloriesByDay[day] > maxCalories) caloriesClassName = 'red';

            return (
              <tr key={id} className={rowClassName}>
                <td>{name}</td>
                <td>{tableDay}</td>
                <td>{tableTime}</td>
                <td className={caloriesClassName}>{calories}</td>
                <td>
                  <Icon onClick={() => history.push(`/${match.params.userId}/edit-meal/${id}`)}>
                    edit
                  </Icon>
                </td>
                <td>
                  <Icon onClick={e => {
                    e.stopPropagation();
                    openModalAction({
                      description: 'Are you sure you want to delete this entry?',
                      buttonFn: () => handleDeleteMeal(id),
                    });
                  }}>
                    delete
                  </Icon>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  
  render() {
    const { classes, history, selectedUser, self, match } = this.props;
    
    return (
      <ManagerNotAllowed>
        <div className={classes.wrapper}>
          <section className='top'>
            <h1>Meals{selectedUser ? ` - ${selectedUser.name}` : ''}</h1>
            <div>
              {self && self.role === 'admin' && <Button id='back' onClick={() => history.push('/users')}>Back</Button>}
              <Button id='add-meal' onClick={() => history.push(`/${match.params.userId}/new-meal`)} >Add meal</Button>
            </div>
          </section>
          <section>
            {this._renderFilters()}
            {this._renderTable()}
          </section>
        </div>
      </ManagerNotAllowed>
    )
  }
}

const mapStateToProps = state => ({
  self: state.users.self,
  meals: state.meals.model,
  selectedUser: state.users.current,
  users: state.users.model,
  userMeals: state.userMeals.model
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, actions)
)(UserDashboard);