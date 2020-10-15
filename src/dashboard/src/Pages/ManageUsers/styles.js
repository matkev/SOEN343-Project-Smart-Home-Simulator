import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root : {

  },
  title: {
    fontSize: '2rem',
    fontWeight: 500,
    marginBottom: '1rem'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline : 'none'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    background: 'white',
    width: 'max-content',
    padding: '2rem',
    borderRadius: '1rem',
    margin: '5rem auto',
    display: 'flex',
    flexDirection: 'column'

  },
  titleModal: {
    fontSize: '1.5rem',
    fontWeight: 500,
    marginBottom: '1rem'
  },
  avatar: {
    alignSelf: 'center',
    height: '4rem',
    width: '4rem',
    marginBottom: '0.5rem'
  },
  property: {
    marginBottom: '0.25rem'
  },

}));


export default useStyles;