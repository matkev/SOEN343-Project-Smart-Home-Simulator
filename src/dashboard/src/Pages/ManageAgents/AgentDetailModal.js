import React from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import {changeAgentAccessRight} from "../../Api/api_agents";
import {toast} from "react-toastify";

const UserDetail = ({open, onClose, user, updateUser}) => {

  const changeAccessRight = (key, value) => {
    const agent = {
      ...user,
      accessRights: {
        ...user.accessRights,
        [key]: value,
      }
    };
    changeAgentAccessRight(user.id, agent).then(res => {
      updateUser(user.id, agent);
    }).catch(err => toast.error(err.message))
  };

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
        <Typography className={classes.property}>Name : {user.agentname}</Typography>
        <Typography className={classes.property}>Access Rights : </Typography>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={user.accessRights?.shcRights}
                           onChange={(e, newValue) => changeAccessRight("shcRights", newValue)}/>}
          label="SHC Rights"
          labelPlacement="SHC Rights"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={user.accessRights?.shpRights}
                           onChange={(e, newValue) => changeAccessRight("shpRights", newValue)}/>}

          label="SHP Rights"
          labelPlacement="SHP Rights"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={user.accessRights?.shhRights}
                           onChange={(e, newValue) => changeAccessRight("shhRights", newValue)}/>}

          label="SHH Rights"
          labelPlacement="SHH Rights"
        />
      </div>
    </Modal>
  );
};

export default UserDetail;