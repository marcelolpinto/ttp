import React, { Component } from 'react'
import { withStyles, Modal as MuiModal, Button } from '@material-ui/core';

const styles = theme => ({
  inner: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    top: 96,
    width: 400,
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.unit * 2,
    outline: 'none',
    borderRadius: theme.unit,
    maxHeight: window.innerHeight - 196,
    overflowY: 'auto',
    textAlign: 'center',
    '& > h2': {
      fontSize: theme.fontSizes.LG,
      marginBottom: 2 * theme.unit
    },
    '& > p': {
      fontSize: theme.fontSizes.SM,
      color: theme.colors.gray.main,
      lineHeight: theme.fontSizes.MMD,
      fontWeight: 500,
      marginBottom: 2 * theme.unit
    },
    '& > button': {
      ...theme.buttons.primary,
      display: 'inline-block'
    }
  }
});

class Modal extends Component {
  render() {
    const { classes, open, handleClose, title, description, buttonLabel, buttonFn } = this.props;
    return (
      <MuiModal
        open={open}
        onClose={handleClose}
        style={{ alignItems: 'center', justifyContent: 'center', transition: "1s" }}
      >
        <div id="modalComponent" className={classes.inner}>
          <h2>{title || 'Warning'}</h2>
          <p>{description}</p>
          <Button onClick={buttonFn} id='confirm'>
            {buttonLabel || 'Confirm'}
          </Button>
        </div>
      </MuiModal>
    )
  }
}

Modal = withStyles(styles)(Modal);

export { Modal };