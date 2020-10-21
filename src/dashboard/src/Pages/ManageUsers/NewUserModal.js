import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {createNewUser} from "../../Api/api_users";
import {getHouseList} from "../../Api/api_houses";
import {useHistory} from 'react-router-dom'

const NewUserModal = ({open, onClose, refreshUsers}) => {

  const history = useHistory();
  const [house, setHouse] = useState({});
  const [newUser, setNewUser] = useState({
    Name: "",
    accessRights: {}
  });

  useEffect(() => {
    if (open)
      getHouseList().then(payload => {
        if (payload && payload.length < 1) {
          onClose();
          history.push("/manage-house");
          return toast.warning("please upload House Layout First");
        }
        setHouse(payload[payload.length - 1]);
      }).catch(err => {
        toast.error(err.message);
      })
  }, [open]);

  const submit = () => {
    if (newUser.Name) {
      const newAgent = {
        agentname: newUser.Name,
        accessRights: newUser.accessRights,
        house_id: house.id,
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
          Add User
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

export default NewUserModal;