import React from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";

const UserDetail = ({open, onClose, user}) => {
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
        <Typography className={classes.property}>ID : {user.ID}</Typography>
        <Typography className={classes.property}>Name : {user.Name}</Typography>
        <Typography className={classes.property}>Permissions : </Typography>
        <FormControlLabel
          value="start"
          control={<Switch color="primary"/>}
          label="Modify temperature"
          labelPlacement="Modify temperature"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary"/>}
          label="Turn On or Turn Off the Lamp"
          labelPlacement="Turn On or Turn Off the Lamp"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary"/>}
          label="Turn On or Turn Off the AC"
          labelPlacement="Turn On or Turn Off the AC"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary"/>}
          label="Lock and Unlock the Door"
          labelPlacement="Lock and Unlock the Door"
        />
      </div>
    </Modal>
  );
};

export default UserDetail;