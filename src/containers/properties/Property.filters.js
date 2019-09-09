import React, { Component } from 'react'
import { compose } from 'recompose';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles, Icon, Collapse, TextField, Button } from '@material-ui/core';
import { Formatter } from '../../helpers';
import { setPropertiesAction, showLoadingAction, closeLoadingAction } from '../../store/actions';
import { PropertiesRepository } from '../../repositories/_lib/Properties.repository';
import { Properties } from '../../entities';

const actions = { setPropertiesAction, showLoadingAction, closeLoadingAction };

const styles = theme => ({
  wrapper: {
    marginTop: 2 * theme.unit,
    marginBottom: 2 * theme.unit,
    '& > div.toggler': {
      display: 'flex',
      justifyContent: 'space-between',
      cursor: 'pointer'
    },
    '& form.collapse': {
      padding: theme.unit,
      '& > div': {
        marginTop: 2 * theme.unit,
        '& > h4': {
          marginBottom: theme.unit,
        },
        '& > div': {
          display: 'inline-block',
          width: '50%',
          padding: '0 8px',
        }
      }
    },
    '& div.buttons': {
      marginTop: 2 * theme.unit,
      '& button + button': {
        marginLeft: 2 * theme.unit,
      }
    }
  }
});

const INITIAL_FORM_VALUES = {
  areaFrom: '',
  areaTo: '',
  priceFrom: '',
  priceTo: '',
  bedroomsFrom: '',
  bedroomsTo: '',
}

class PropertyFilters extends Component {

  state = {
    isOpen: false, 
    ...INITIAL_FORM_VALUES
  }



  _handleChange(e) {
    this.setState({ [e.target.id]: Formatter.numberWithCommas(e.target.value) });
  }



  async _handleSubmit(e) {
    e.preventDefault();

    const values = { ...this.state };
    delete values.isOpen;

    Object.keys(values).forEach(key => {
      if(!values[key]) delete values[key];
      else values[key] = parseInt(Formatter.number(values[key]));
    });
    
    const token = window.localStorage.getItem('token');
    values.token = token;

    const query = queryString.stringify(values);
    
    const repo = new PropertiesRepository();

    this.props.showLoadingAction();
    const properties = await repo.list(query);
    this.props.closeLoadingAction()

    if(!properties.err) {
      const newProperties = new Properties(properties.data);
      this.props.setPropertiesAction(newProperties);
    }
  }


  
  async _handleClear(e) {
    e.preventDefault();

    const token = window.localStorage.getItem('token');
    const query = queryString.stringify({ token });
    
    const repo = new PropertiesRepository();

    this.props.showLoadingAction();
    const properties = await repo.list(query);
    this.props.closeLoadingAction()

    if(!properties.err) {
      const newProperties = new Properties(properties.data);
      this.props.setPropertiesAction(newProperties);
    }
    
    this.setState({ ...INITIAL_FORM_VALUES });
  }

  

  render() {
    const {
      isOpen,
      areaFrom,
      areaTo,
      priceFrom,
      priceTo,
      bedroomsFrom,
      bedroomsTo
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className='toggler' onClick={() => this.setState({ isOpen: !isOpen })}>
          <h3>Filters</h3>
          <Icon>{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
        </div>
        <Collapse in={isOpen}>
          <form onSubmit={this._handleSubmit.bind(this)} className='collapse'>
            <div>
              <h4>Area</h4>
              <div>
                <TextField
                  id='areaFrom'
                  label='From'
                  value={areaFrom}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
              <div>
                <TextField
                  id='areaTo'
                  label='To'
                  value={areaTo}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
            </div>
            <div>
              <h4>Bedrooms</h4>
              <div>
                <TextField
                  id='bedroomsFrom'
                  label='From'
                  value={bedroomsFrom}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
              <div>
                <TextField
                  id='bedroomsTo'
                  label='To'
                  value={bedroomsTo}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
            </div>
            <div>
              <h4>Price (U$)</h4>
              <div>
                <TextField
                  id='priceFrom'
                  label='From'
                  value={priceFrom}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
              <div>
                <TextField
                  id='priceTo'
                  label='To'
                  value={priceTo}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
            </div>
            <div className='buttons'>
              <Button
                onClick={this._handleSubmit.bind(this)}
                type='submit'
                id='apply'
              >
                Apply filters
              </Button>
              <Button
                onClick={this._handleClear.bind(this)}
                id='clear'
              >
                Clear filters
              </Button>
            </div>
          </form>
        </Collapse>
      </div>
    )
  }
}

PropertyFilters = compose(
  withRouter,
  connect(null, actions),
  withStyles(styles),
)(PropertyFilters);

export { PropertyFilters };