import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  container: {
    background: "white",
    width: "30rem",
    margin: "10rem auto",
    display: "flex",
    flexDirection: "column",
    zIndex: 1
  },
  headerText: {
    margin: '1rem',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  tab: {
    flex: 1,
    fontFamily: 'shabnam !important'
  },
  containerInput: {
    padding: '1rem 0.8rem',
    display: 'flex',
    flexDirection: 'column'
  },
  ulog: {
    height: '9rem',
    width: '9rem',
    margin: '1rem auto',
  },
  cover: {
    position: "fixed",
    height: "100vh",
    width: '100vw',
    left: 0,
    top: 0,
    opacity: 0.3,
    zIndex : -1
  },
  formControl:{
    flex : 1,
    marginRight : '1rem !important'
  }
}));


export default useStyles;