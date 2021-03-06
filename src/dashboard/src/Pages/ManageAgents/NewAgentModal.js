import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {createNewAgent} from "../../Api/api_agents";

const NewAgentModal = ({open, onClose, refreshUsers}) => {

  const [newUser, setNewUser] = useState({
    Name: "",
    accessRights: {}
  });

  const submit = () => {
    if (newUser.Name) {
      const newAgent = {
        agentname: newUser.Name,
        accessRights: newUser.accessRights,
        house_id: localStorage.getItem("houseId"),
        room_id: null,
        isAway: false
      };
      createNewAgent(newAgent).then(res => {
        refreshUsers()
        onClose();
      }).catch(err => toast.error(err.message));
    } else toast.warning("Please fill name input")
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
          Add Agent
        </Typography>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={newUser.Name} onChange={e => {
          const newState = {...newUser, Name: e.target.value};
          setNewUser(newState);
        }}/>
        <Typography className={classes.property}>Permissions : </Typography>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.accessRights.shcRights} onChange={e => {
            setNewUser(user => ({...user, accessRights: {...user.accessRights, shcRights: e.target.checked}}))
          }}/>}
          label="SHC Rights"
          labelPlacement="SHC Rights"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.accessRights.shpRights} onChange={e => {
            setNewUser(user => ({...user, accessRights: {...user.accessRights, shpRights: e.target.checked}}))
          }}/>}
          label="SHP Rights"
          labelPlacement="SHP Rights"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.accessRights.shhRights} onChange={e => {
            setNewUser(user => ({...user, accessRights: {...user.accessRights, shhRights: e.target.checked}}))
          }}/>}
          label="SHH Rights"
          labelPlacement="SHH Rights"
        />
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => submit(e)}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default NewAgentModal;