import React from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";

const RoomModal = ({open, onClose, room,setRoom}) => {
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
        <Typography className={classes.titleModal}>
          Room Details
        </Typography>
        {/*<Avatar src={"/assets/images/man.png"} className={classes.avatar}/>*/}
        <Typography className={classes.property}>Name : {room.name}</Typography>
        <Typography className={classes.property}>Windows : {room.windows}</Typography>
        <Typography className={classes.property}>Lights : {room.lights}</Typography>
        <Typography className={classes.property}>Doors To :
          {room.doorsTo?.map(item=>{
          return <Button size={'small'} variant={"outlined"} onClick={()=>setRoom(item)}>{item}</Button>
        })}</Typography>
      </div>
    </Modal>
  );
};

export default RoomModal;