import React, {useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {useDashboardState} from "../../../context/DashboardContext";

const ChangeTemperatureDialog = ({open,handleClose,temp,setTemp}) => {

  const logDispatch = useLogDispatch();
  const {activeAgent,activeAgentDetail} = useDashboardState();
  const [input,setInput]= useState(temp);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Change Temperature</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter temperature of inside ...
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="Temperature"
          label="Temperature"
          type="number"
          fullWidth
          value={input}
          onChange={e=>setInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={()=>{
          if(temp===undefined)
            return;
          setTemp(input);
          addLog(logDispatch,"changed inside temperature to "+input+"°C",activeAgent);
          handleClose();
        }} color="primary">
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeTemperatureDialog;