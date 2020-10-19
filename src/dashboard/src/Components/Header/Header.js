import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import useStyle from './styles'
import Button from "@material-ui/core/Button";
import {Link, useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack} from "@material-ui/icons";

const Header = () => {
  const classes = useStyle();
  const history = useHistory();
  const logoutClick = () => {
    localStorage.clear();
    window.location.reload();
  };
  console.log(history, history.location.pathname !== "/");
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {history.location.pathname !== "/" &&
        <IconButton onClick={()=>history.push("/")}>
          <ArrowBack/>
        </IconButton>
        }
        <Link to={"/"}><Typography>Soen 343</Typography></Link>
        <Button size={'small'} className={classes.logoutBtn} onClick={logoutClick}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;