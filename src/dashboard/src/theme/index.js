import {createMuiTheme} from "@material-ui/core";
import tinyColor from 'tinycolor2'

const colorPrimary = "#5ea9dd";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: colorPrimary,
      light: tinyColor(colorPrimary).lighten().toHexString()
    }
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
    }
  }
})

export default Theme;