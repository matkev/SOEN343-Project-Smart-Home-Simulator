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
import {createNewSimContext, getSimContextList} from "../../Api/api_simContexts";
import {getHouseList} from "../../Api/api_house";
import {useHistory} from 'react-router-dom'

import { MuiPickersUtilsProvider,  DateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const NewASimContextModal = ({open, onClose, refreshSimContexts}) => {

  const history = useHistory();
  const [house, setHouse] = useState({});
  const [newASimContext, setNewASimContext] = useState({
    lastDate: new Date().getTime()
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
    if (newASimContext.lastDate) {
      const newSimContext = {
        lastDate: newASimContext.lastDate,
      };
      createNewSimContext(newSimContext).then(res => {
        refreshSimContexts()
        onClose();
      }).catch(err => toast.error(err.message));
    } else toast.warning("Please fill lastDate input")
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
          Add SimContext
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
                autoOk
                ampm={false}
                views={["year", "month", "date", "hours", "minutes", "seconds"]}
                label="DateTimePicker"
                inputVariant="outlined"
                value={newASimContext.lastDate}
                onChange={(newDate)=>{
                  const newState = {...newASimContext, lastDate: newDate.getTime()};
                  setNewASimContext(newState);}}/>
        </MuiPickersUtilsProvider>
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

export default NewASimContextModal;