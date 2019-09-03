import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { withStyles, Menu, MenuItem, Button, Icon } from '@material-ui/core';

const actions = {};

const styles = theme => ({
  wrapper: {
    height: theme.sizes.HEADER_HEIGHT,
    backgroundColor: theme.colors.blue.light,
    boxShadow: theme.shadows[1],
    paddingLeft: 2 * theme.unit,
    paddingRight: 2 * theme.unit,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > h3': {
      color: 'white',
      fontWeight: 400,
      lineHeight: `${theme.sizes.HEADER_HEIGHT}px`,
      cursor: 'pointer'
    },
    '& p.welcome': {
      display: 'inline-block',
      color: 'white',
      marginRight: 8
    }
  }
});

class Header extends Component {
  state = {
    anchorEl: null
  }

  render() {
    const { anchorEl } = this.state;
    const { classes, history, homeClick, logout, self } = this.props;

    return (
      <div className={classes.wrapper}>
        <h3 onClick={homeClick}>TTP Properties</h3>
        <div>
          <p className='welcome'>Welcome{self ? `, ${self.name}` : ''}</p>
          <Button
            style={{ color: 'white' }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={e => this.setState({ anchorEl: e.currentTarget })} >
            <Icon>menu</Icon>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={!!anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
          >
            <MenuItem onClick={() => { this.setState({ anchorEl: null }); history.push('/settings'); }}>Settings</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({});

Header = compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, actions)
)(Header);

export { Header };