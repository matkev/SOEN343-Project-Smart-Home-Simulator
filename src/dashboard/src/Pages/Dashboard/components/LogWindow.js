import React, {useEffect, useRef} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import {useLogState} from "../../../context/LogContext";

const LogWindow = () => {
  const classes = useStyle();
  const {logs} = useLogState();
  const ulRef = useRef();

  useEffect(() => {
    ulRef.current.scrollIntoView({behavior: 'smooth'})
  }, [logs]);

  return (
    <div className={classes.logWindow}>
      <Typography className={classes.previewTitle}>Output Console</Typography>
      <ul>
        {logs.map((item) => <li>{item}</li>)}
        <div ref={ulRef}/>
      </ul>
    </div>
  );
};

export default LogWindow;