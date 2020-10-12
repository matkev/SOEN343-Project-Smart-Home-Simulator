import React, {useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";

const LogWindow = () => {
  const classes = useStyle();
  const [logs,setLogs] = useState([
    "10:40 Admin : Main Doors was open by parent",
    "10:40 Admin : Main Doors was open by child",
  ]);
  return (
    <div className={classes.logWindow}>
      <Typography className={classes.previewTitle}>Output Console</Typography>
      {logs.map((item)=><Typography>{item}</Typography>)}
    </div>
  );
};

export default LogWindow;