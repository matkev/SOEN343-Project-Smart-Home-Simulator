import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

const Sidebar = () => {
  const classes = useStyle();

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
      <Typography className={classes.sidebarTime}>{new Date().toLocaleString()}</Typography>
    </div>
  );
};

export default Sidebar;