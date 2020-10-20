import React, {useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";

const LogWindow = () => {
  const classes = useStyle();
  const [logs,setLogs] = useState([
    "time ,user : to be updated",
  ]);
  return (
    <div className={classes.logWindow}>
      <Typography className={classes.previewTitle}>Output Console</Typography>
      {logs.map((item)=><Typography>{item}</Typography>)}
    </div>
  );
};

export default LogWindow;