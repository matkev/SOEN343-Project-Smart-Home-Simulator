import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import {patchAgent} from "../../Api/api_agents";
import {toast} from "react-toastify";
import classNames from "classnames";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {getRoomList} from "../../Api/api_rooms";

const AgentDetail = ({open, onClose, user, updateUser}) => {

  const [rooms ,setRooms] = useState([]);

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => toast.error(err.message))
  }, []);

  const changeAccessRight = (key, value) => {
    const agent = {
      ...user,
      accessRights: {
        ...user.accessRights,
        [key]: value,
      }
    };
    patchAgent(user.id, agent).then(res => {
      updateUser(user.id, agent);
    }).catch(err => toast.error(err.message))
  };

  const handleChangeLocation = (e)=>{
    const agent = {
      ...user,
      room_id : e.target.value|| null,
    };
    patchAgent(user.id, agent).then(res => {
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
          Agent Detail
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
        <FormControl variant="outlined" className={classNames(classes.formControl,"uni_m_b_small")}>
          <InputLabel id="demo-simple-select-outlined-label">Location</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={user.room_id}
            onChange={handleChangeLocation}
            label="Location"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {rooms.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
    </Modal>
  );
};

export default AgentDetail;