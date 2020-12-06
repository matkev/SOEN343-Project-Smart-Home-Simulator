import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {createNewZone} from "../../Api/api_zones";
import ValueController from '../Dashboard/sidebar/ValueController';

const NewZoneModal = ({open, onClose, refreshZones}) => {
  const [newZone, setNewZone] = useState({
    name: "",
    periods: [{temperatureSetting: 0}, {temperatureSetting:0}, {temperatureSetting:0}]
  });

  const submit = () => {
    if (newZone.name) {
      const newZ = {
        name: newZone.name,
        house_id: localStorage.getItem("houseId"),
        periods: newZone.periods
      };
      createNewZone(newZ).then(res => {
        refreshZones();
        onClose();
      }).catch(err => toast.error(err.message));
    } else toast.warning("Please fill name input")
  };
  const classes = useStyle();
  if (newZone.periods === undefined){
    newZone.periods =  [{temperatureSetting: 0}, {temperatureSetting:0}, {temperatureSetting:0}];
  }
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
          Add Zone
        </Typography>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={newZone.name} onChange={e => {
          const newState = {...newZone, name: e.target.value};
          setNewZone(newState);
        }}/>
        <Typography className={classes.property}>Periods : </Typography>
        {[0,1,2].map((i)=>
          <ValueController 
            key={i}
            slider={false}
            min={-50}
            max={50}
            value={newZone.periods[i]?.temperatureSetting} 
            onValueChangeCommitted = {(e, v)=> {
              newZone.periods[i].temperatureSetting = v;
            }} 
          />
        )}
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

export default NewZoneModal;