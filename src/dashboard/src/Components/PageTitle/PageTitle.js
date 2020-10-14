import React from "react";
import { Button } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import {Typography} from "../Wrappers";

export default function PageTitle({title,button,onClickButton}) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h3" size="sm">
        {title}
      </Typography>
      {button && (
        <Button
          classes={{ root: classes.button }}
          variant="contained"
          size="large"
          color="secondary"
          onClick={onClickButton}
        >
          {button}
        </Button>
      )}
    </div>
  );
}
