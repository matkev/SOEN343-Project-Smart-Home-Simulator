import React from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";

const Preview = () => {
  const classes = useStyle();
  return (
    <div className={classes.preview}>
      <Typography className={classes.sidebarTitle}>Preview</Typography>
      <img src={"assets/images/home-map.jpg"}/>
    </div>
  );
};

export default Preview;