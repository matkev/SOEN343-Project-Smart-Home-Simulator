import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import SingleFileAutoSubmit from "../../Components/Wrappers/SingleFileAutoSubmit";

const UploadHouseLayoutModal = ({open, onClose, room}) => {
  const classes = useStyle();
  const [loading, setLoading] = useState();
  const [files, setFiles] = useState([]);
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
        <SingleFileAutoSubmit/>
      </div>
    </Modal>
  );
};

export default UploadHouseLayoutModal;