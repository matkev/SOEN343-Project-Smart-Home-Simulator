import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  container: {
    display: "grid",
    gridTemplateColumns: "20% 1fr 1fr",
    gridTemplateRows: 'calc(80vh - 96px) 20vh',
    gridTemplateAreas: `"sidebar modules preview"
      "sidebar log log"`,
    gap: '1rem'
  },
  sidebar: {
    gridArea: 'sidebar',
    border: "1px solid black",
    borderRadius: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sidebarTitle: {
    width: "max-content",
    background: "black",
    color: "white",
    borderRadius: "1rem",
    padding: "0.3rem 1rem",
    marginBottom: "2rem",
    transform: "translateY(-34%)",
    marginLeft: "1rem",
    alignSelf: "flex-start"
  },
  previewTitle: {
    width: "max-content",
    background: "black",
    color: "white",
    borderRadius: "1rem",
    padding: "0.3rem 1rem",
    transform: "translateY(-34%)",
    marginLeft: "1rem",
    alignSelf: "flex-start"
  },
  sidebarAvatar: {
    width: '5rem !important',
    height: '5rem !important',
    marginBottom: '1rem',
  },
  sidebarName: {
    fontSize: '1.7rem',
    marginBottom: '0.5rem'
  },
  sidebarLoc: {
    marginBottom: 'auto',
  },
  sidebarTemp: {
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: "0.8rem",
    fontStyle: "italic",
    color: "#333"
  },
  sidebarTime: {
    marginTop: "2rem",
    marginBottom: "2rem",
    fontSize: "0.8rem",
    fontStyle: "italic",
    color: "#333"
  },
  modules: {
    gridArea: 'modules',
    display: 'flex',
    flexDirection: 'column',
  },
  preview: {
    gridArea: 'preview',
    border: "1px solid black",
    borderRadius: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    "& > img ": {
      height: '80%',
      width: '100%'
    }
  },
  logWindow: {
    gridArea: 'log',
    border: "1px solid black",
    borderRadius: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    "& > p ": {
      fontSize: '0.8rem',
      textAlign: 'left',
      margin: '0.1rem 0.5rem'
    },

    "&> ul ": {
      overflowY : 'auto',
      margin : 'unset',
      marginBottom : '1rem'
    }
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
    padding: "unset"
  },
  tabActive: {
    backgroundColor: 'black',
    color: 'white !important'
  },
  moduleContent: {
    flex: 1,
    border: '1px solid black',
    borderTop: '4px solid black',
    borderRadius: "0 0.5rem 0.5rem 0.5rem",
    padding: '1rem'
  },
  otherModuleBox: {
    borderRadius: '0.1rem',
    border: '1px solid gray',
    marginBottom: '0.5rem',


    "& > ul": {
      margin: 'unset',
      padding: 'unset',
      listStyle: 'none',
      minHeight: '6rem',
      maxHeight: '6rem',
      overflowY: 'auto',

      "& > li": {
        fontFamily: "roboto",
        padding: '0.2rem',
        fontSize: '0.85rem',
        transition: "backgroundColor 0.1s linear",
        borderBottom: "1px solid #7777",
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",

      }
    }
  },
  moduleBox: {
    borderRadius: '0.1rem',
    border: '1px solid gray',
    marginBottom: '0.5rem',


    "& > ul": {
      margin: 'unset',
      padding: 'unset',
      listStyle: 'none',
      minHeight: '6rem',
      maxHeight: '6rem',
      overflowY: 'auto',

      "& > li": {
        fontFamily: "roboto",
        padding: '0.2rem',
        fontSize: '0.85rem',
        transition: "backgroundColor 0.1s linear",
        cursor: 'pointer',
        borderBottom: "1px solid #7777",
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",

        "&:hover": {
          backgroundColor: '#999',
          color: 'white',
        },

        "&.activeRoom": {
          backgroundColor: 'gray',
          color: 'white',
        }
      }
    }
  },
  roomDetailParent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: '0.5rem',

    "& > div": {
      marginBottom: "unset"
    },
    "& > div:last-child": {
      gridColumn: '1 / 3'
    },
  },
  moduleBoxHeader: {
    borderBottom: '1px solid gray',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontFamily: "roboto",
    fontWeight: 'bold'
  },
  MuserBtn: {
    marginBottom: '1rem',
  }

}));
export default useStyles;