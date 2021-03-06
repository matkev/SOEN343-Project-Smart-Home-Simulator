import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {createNewUser} from "../../Api/api_users";

const NewUserModal = ({open, onClose, refreshUsers}) => {

  const [newUser, setNewUser] = useState({username: ""});

  const submit = () => {
    if (newUser.username) {
      createNewUser(newUser).then(res => {
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
          const newState = {...newUser, username: e.target.value};
          setNewUser(newState);
        }}/>
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