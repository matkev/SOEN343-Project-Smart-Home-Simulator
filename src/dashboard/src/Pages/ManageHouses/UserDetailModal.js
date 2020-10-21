import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import {patchUser} from "../../Api/api_users";
import {toast} from "react-toastify";
import classNames from "classnames";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {getRoomList} from "../../Api/api_rooms";

const UserDetail = ({open, onClose, user, updateUser}) => {


  const classes = useStyle();
  return (
    <Modal open={open} onClose={onClose}
           aria-labelledby="transition-modal-title"
           aria-describedby="transition-modal-description"
           className={classes.modal}
           closeAfterTransition
           BackdropComponent={Backdrop}
           BackdropProps={{
             timeout: 500,
           }}>
      <div className={classes.paper}>
        <Typography className={classes.title}>
          User Detail
        </Typography>
        <Avatar src={"/assets/images/man.png"} className={classes.avatar}/>
        <Typography className={classes.property}>ID : {user.id}</Typography>
        <Typography className={classes.property}>Name : {user.username}</Typography>
      </div>
    </Modal>
  );
};

export default UserDetail;