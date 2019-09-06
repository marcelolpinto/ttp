import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { withStyles, Menu, MenuItem, Button, Icon, Avatar } from '@material-ui/core';

const NO_IMAGE_URL = 'https://cdn4.iconfinder.com/data/icons/eldorado-user/40/user-128.png';

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
    '& > div.left': {
      display: 'flex',
      justifyContent: 'space-between',
      '& > h3': {
        color: 'white',
        fontWeight: 400,
        lineHeight: `${theme.sizes.HEADER_HEIGHT}px`,
        cursor: 'pointer',
        marginRight: 4 * theme.unit,
      },
      '& > button': {
        color: 'white',
        paddingLeft: 3 * theme.unit,
        paddingRight: 3 * theme.unit,
      }
    },
    '& p.welcome': {
      display: 'inline-block',
      color: 'white',
      verticalAlign: 'middle',
      marginRight: 8,
    },
    '& div.avatar': {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: 16,
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
        <div className='left'>
          <h3 onClick={homeClick}>TTP Properties</h3>
          <Button id='users' onClick={() => history.push('/users')}>Users</Button>
          <Button id='properties' onClick={() => history.push('/properties')}>Properties</Button>
        </div>
        <div>
          <Avatar className='avatar' src={self && self.imageUrl ? self.imageUrl : NO_IMAGE_URL} />
          <p className='welcome'>{self && self.name}</p>
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
            {
              (self && self.role === 'admin') &&
              <MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  history.push('/invite');
                }}>
                Invite
              </MenuItem>
            }
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