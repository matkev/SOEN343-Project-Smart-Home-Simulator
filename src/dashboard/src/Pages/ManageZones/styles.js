import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontSize: '2rem',
    fontWeight: 500,
    marginBottom: '1rem'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
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
    flexDirection: 'column',
    minWidth: '20rem'

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
  minMaxInput: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    flex: 1,
    border: '1px solid black',
    borderTop: '4px solid black',
    borderRadius: "0 0.5rem 0.5rem 0.5rem",
    padding: '1rem',
    overflow: 'auto'
  },

  tabs: {
    height: 'max-content'
  },
  tab: {
    width: "max-content !important",
    minWidth: "4rem !important",
    border: "1px solid black",
    borderBottom: 0,
    minHeight: "1rem !important",
    height: "2rem !important",
    padding: "1rem"
  },
  tabActive: {
    backgroundColor: 'black',
    color: 'white !important'
  },
  roomList:{
    display : 'grid',
    gridTemplateColumns : '1fr 1fr',
    gap : '1rem'
  }
}));


export default useStyles;