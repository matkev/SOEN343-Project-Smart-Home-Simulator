import React from "react";
import {Typography} from "@material-ui/core";
import classnames from "classnames";
import useStyle from './Typography.style'

export default ({widgetHeader, p, title, tinyText, hint, className, children, ...props}) => {
  const classes = useStyle();
  return <Typography
    className={classnames(widgetHeader && classes.widgetHeader,
      tinyText && classes.tinyText,
      p && classes.p,
      title && classes.title,
      title !== undefined ? title === 2 ? classes.title2 : title === 3 ? classes.title3 : title === 4 && classes.title4 : undefined,
      hint && classes.hint,
      className)} {...props}>{children}</Typography>
}