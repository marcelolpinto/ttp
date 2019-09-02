import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Button, TextField } from '@material-ui/core';
import compose from 'recompose/compose';
import DatePicker from 'react-datepicker'

import { setMealsAction, showLoadingAction, closeLoadingAction, setUserMealsAction } from '../../store/actions';
import { BaseContainer } from '../../helpers';
import "react-datepicker/dist/react-datepicker.css";
import { CreateMealController } from './CreateMeal.controller';
import ManagerNotAllowed from '../../ManagerNotAllowed';

const actions = { setMealsAction, showLoadingAction, closeLoadingAction, setUserMealsAction };

const styles = theme => ({
  wrapper: {
    ...theme.logedInWrapper,
    '& > form': {
      marginTop: 2 * theme.unit,
      '& .text-input + .text-input': {
        marginLeft: theme.unit
      },
      '& div.-error': {
        '& label': {
          color: theme.colors.red.main,
          '&.error': {
            display: 'block',
            transform: 'translateY(12px)',
            marginLeft: 12,
            fontSize: theme.fontSizes.XS
          }
        },
        '& .react-datepicker-wrapper:after': {
          position: 'absolute',
          content: '""',
          bottom: -6,
          left: 0,
          height: 2,
          width: '100%',
          backgroundColor: theme.colors.red.main
        }
      },
      '& .react-datepicker-wrapper': {
        marginLeft: theme.unit,
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
      '& > button#save-meal': {
        ...theme.buttons.primary,
        display: 'inline-block',
        marginTop: 2 * theme.unit
      },
      '& > button#back': {
        ...theme.buttons.secondary,
        display: 'inline-block',
        marginTop: 2 * theme.unit,
        marginLeft: 2 * theme.unit
      }
    }
  }
});

class CreateMeal extends BaseContainer {
  constructor(props) {
    super(props, CreateMealController);
  }

  state = {
    name: '',
    calories: '',
    date: new Date(),
    
    errors: {}
  }

  componentDidMount() {
    const { history, selectedUser, self, match } = this.props;
    if(self && self.role === 'admin' && !selectedUser) {
      history.push(`/dashboard/${match.params.userId}`);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { self, selectedUser, match, history } = nextProps,
    prevSelf = this.props.self;
    
    if(!prevSelf && self && self.role === 'admin' && !selectedUser) {
      history.push(`/dashboard/${match.params.userId}`);
    }
  }

  render() {
    const { classes, history, selectedUser } = this.props;
    const { errors } = this.state;
    const { handleChange, handleSubmit } = this.controller;

    return (
      <ManagerNotAllowed>
        <div className={classes.wrapper}>
          <h1>New Meal{selectedUser ? ` - ${selectedUser.name}` : ''}</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              error={!!errors.name}
              helperText={errors.name}
              id='name'
              label='Name *'
              className='text-input'
              value={this.state.name}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.calories}
              helperText={errors.calories}
              id='calories'
              label='Number of Calories (kcal) *'
              className='text-input'
              value={this.state.calories}
              onChange={e => handleChange(e, 'number')}
            />
            <div className={errors.date ? '-error' : ''} style={{ display: 'inline-block' }} >
              <label style={{
                display: 'block',
                fontSize: '12px',
                marginBottom: '8px',
                marginLeft: '8px'
              }}>Date *</label>
              <DatePicker
                selected={this.state.date}
                onChange={date => this.setState({ date, errors: { ...errors, date: '' } })}
                timeIntervals={15}
                showTimeSelect
                dateFormat="Pp"
              />
              <label className='error'>{errors.date}</label>
            </div>
            <br/>
            <Button
              type='submit'
              id='save-meal'
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button id='back' onClick={history.goBack}>
              Back
            </Button>
          </form>
        </div>
      </ManagerNotAllowed>
    )
  }
}

const mapStateToProps = state => ({
  meals: state.meals.model,
  self: state.users.self,
  selectedUser: state.users.current,
  userMeals: state.userMeals.model
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, actions)
)(CreateMeal);