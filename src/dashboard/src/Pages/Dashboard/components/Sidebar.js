import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom'
import Clock from './Clock';

const Sidebar = ({weather}) => {
  const classes = useStyle();
  const history = useHistory();

  const [time, setTime] = useState();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time => Math.random());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.sidebar}>
      <Typography className={classes.sidebarTitle}>Simulation</Typography>
      <Avatar src={localStorage.getItem("image")} className={classes.sidebarAvatar}/>
      <Typography className={classes.sidebarName}>{localStorage.getItem("name")}</Typography>
      <Button className={classes.MuserBtn} color={"secondary"} variant={"contained"} onClick={() => {
        history.push("/manage-users")
      }}>Manage Users</Button>
      <Button color={"secondary"} variant={"contained"} onClick={() => {
        history.push("/manage-house")
      }}>Manage Houselayout</Button>
      <Typography className={classes.sidebarTemp}>Outside Temperature : {weather.current?.temperature}°C</Typography>
      <Typography className={classes.sidebarTime}>{new Date().toLocaleString()}</Typography>
      <Clock />
    </div>
  );
};

export default Sidebar;