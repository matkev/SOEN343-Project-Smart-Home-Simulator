import React from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import {toast} from "react-toastify";

const SimContextDetail = ({open, onClose, simContext, updateSimContext}) => {

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
          SimContext Detail
        </Typography>
        <Avatar src={"/assets/images/man.png"} className={classes.avatar}/>
        <Typography className={classes.property}>ID : {simContext.id}</Typography>
        <Typography className={classes.property}>Last Date : {new Date(simContext.lastDate).toLocaleString()}</Typography>
        
      </div>
    </Modal>
  );
};

export default SimContextDetail;