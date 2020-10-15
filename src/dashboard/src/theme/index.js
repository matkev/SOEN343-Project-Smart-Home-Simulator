import {createMuiTheme} from "@material-ui/core";
import tinyColor from 'tinycolor2'

const colorPrimary = "#5ea9dd";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: colorPrimary,
      light: tinyColor(colorPrimary).lighten().toHexString()
    },
  },
  customShadows: {
    widget:
      "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetDark:
      "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetWide:
      "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
  },
  overrides: {
    MuiTypography: {
      root: {
        fontFamily: "roboto !important",
      }
    }, MuiListItem: {
      button: {
        fontFamily: "roboto !important",
      }
    }, MuiButton: {
      label: {
        fontFamily: "roboto !important",
      }
    },
    PrivateTabIndicator: {
      root: {
        display: 'none'
      }
    },
    MuiTabs: {
      root: {
        minHeight: '2rem !important',
        height: '2rem !important'
      }
    }
  }
})

export default Theme;