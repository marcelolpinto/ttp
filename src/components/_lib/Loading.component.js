import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  wrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,.7)',
  },
  progress: {
    '& *': {
      color: theme.colors.blue.main
    }
  },
});

let Loading = props => {
  const { classes } = props;

  return (
    <div className={classes.wrapper} >
      <CircularProgress className={classes.progress} size={40} />
    </div>
  );
}

Loading = withStyles(styles)(Loading);

export { Loading };