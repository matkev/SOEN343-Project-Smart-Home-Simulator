import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  fakeToolbar: {
    height: "48px !important",
    minHeight: "48px !important",
  },
  content: {
    padding: '1rem',
    flex: 1,
    height : 'calc(100vh - 48px)'
  },
  container:{
    display : 'flex',
    flexDirection : 'column',
    height : '100vh'
  }
}));


export default useStyles;