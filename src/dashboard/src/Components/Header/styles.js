import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  appBar: {
    width: "100vw",
    background: "#1ABC9C",
    zIndex: 1,
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down(400)]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    height: "48px !important",
    minHeight: "48px !important",
  },
  logoutBtn: {
    marginLeft : 'auto'
  }
}));


export default useStyles;