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

const NewUserModal = ({open, onClose, addUser}) => {

  const [newUser, setNewUser] = useState({
    Name: "",
    permissions: {
      light: false,
      ac: false,
      temp: false,
      doors: false
    }
  });

  const submit = () => {
    if (newUser.Name)
      addUser({...newUser, ID: Math.floor(Math.random() * 100000)});
    else toast.warning("Please fill name input")
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
          control={<Switch color="primary" checked={newUser.permissions.temp} onChange={e => {
            setNewUser(user => ({...user, permissions: {...user.permissions, temp: e.target.checked}}))
          }}/>}
          label="Modify temperature"
          labelPlacement="Modify temperature"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.permissions.light} onChange={e => {
            setNewUser(user => ({...user, permissions: {...user.permissions, light: e.target.checked}}))
          }}/>}
          label="Turn On or Turn Off the Lamp"
          labelPlacement="Turn On or Turn Off the Lamp"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.permissions.ac} onChange={e => {
            setNewUser(user => ({...user, permissions: {...user.permissions, ac: e.target.checked}}))
          }}/>}
          label="Turn On or Turn Off the AC"
          labelPlacement="Turn On or Turn Off the AC"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked={newUser.permissions.doors} onChange={e => {
            setNewUser(user => ({...user, permissions: {...user.permissions, doors: e.target.checked}}))
          }}/>}
          label="Lock and Unlock the Door"
          labelPlacement="Lock and Unlock the Door"
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