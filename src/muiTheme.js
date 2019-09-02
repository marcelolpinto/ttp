import { createMuiTheme } from '@material-ui/core/styles';

const GREEN = '#009541';
const BLUE = '#303F9F';
const LIGHT_BLUE = '#394177';
const RED = '#F44336';

const BLACK = '#141414';

const GRAY = '#616161';
const LIGHT_GRAY = '#F2F2F2';
const DARK_GRAY_BG = '#DEDEDE';
const GRAY_BG = '#EFEFEF';
const GRAY_BORDER = '#D1DBE3';

const XXS = '11px';
const XS = '12px';
const XSM = '13px';
const SM = '14px';
const MD = '15px';
const MMD = '18px';
const LG = '20px';
const XL = '28px';
const XXL = '48px';

const nXXS = 11;
const nXS = 12;
const nXSM = 13;
const nSM = 14;
const nMD = 15;
const nMMD = 18;
const nLG = 20;
const nXL = 28;
const nXXL = 48;

const SPACING_UNIT = 8;
const HEADER_HEIGHT = 64;

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto'
  },
  fontSizes: { XXS, XS, XSM, SM, MD, MMD, LG, XL, XXL, nXXS, nXS, nXSM, nSM, nMD, nMMD, nLG, nXL, nXXL },
  colors: {
    green: {
      main: GREEN,
    },
    blue: {
      main: BLUE,
      light: LIGHT_BLUE,
    },
    gray: {
      main: GRAY,
      light: LIGHT_GRAY,
      bg: GRAY_BG,
      darkBg: DARK_GRAY_BG,
      border: GRAY_BORDER,
    },
    black: {
      main: BLACK
    },
    red: {
      main: RED
    }
  },
  buttons: {
    primary: {
      backgroundColor: BLUE,
      color: 'white',
      fontSize: MD,
      fontWeight: 700,
      padding: `${SPACING_UNIT}px ${2 * SPACING_UNIT}px`,
      borderRadius: `${SPACING_UNIT}px`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: BLUE
      },
      '& > span': {
        color: 'white'
      }
    },
    secondary: {
      backgroundColor: 'white',
      color: BLUE,
      fontSize: MD,
      fontWeight: 700,
      padding: `${SPACING_UNIT}px ${2 * SPACING_UNIT}px`,
      borderRadius: `${SPACING_UNIT}px`,
      border: `1px solid ${BLUE}`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'white'
      },
      '& > span': {
        color: BLUE
      }
    },
    error: {
      backgroundColor: RED,
      color: 'white',
      fontSize: SM,
      fontWeight: 700,
      padding: `${SPACING_UNIT}px ${2 * SPACING_UNIT}px`,
      borderRadius: `${SPACING_UNIT}px`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: RED
      },
      '& > span': {
        color: 'white'
      }
    }
  },
  inputs: {
    text: {},
    radio: {},
    checkbox: {},
  },
  sizes: {
    HEADER_HEIGHT,
  },
  unit: SPACING_UNIT,
  logedInWrapper: {
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    overflowY: 'auto',
    padding: 2 * SPACING_UNIT,
    backgroundColor: DARK_GRAY_BG
  }
});

export default theme;