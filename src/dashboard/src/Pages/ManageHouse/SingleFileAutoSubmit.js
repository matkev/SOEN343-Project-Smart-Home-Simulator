import React, {useState} from 'react';
import Dropzone from "react-dropzone-uploader";
import Spacer from "../../Components/Wrappers/Spacer";
import TextField from "@material-ui/core/TextField";
import {BASE_URL} from "../../Api/api";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Modal from "@material-ui/core/Modal";
import useStyle from "./styles";
import {addLog, useLogDispatch} from "../../context/LogContext";

const SingleFileAutoSubmit = ({refreshHouses, open, onClose}) => {

  const [houseName, setHouseName] = useState();
  const classes = useStyle();

  const logDispatch = useLogDispatch();


  const toast = (innerHTML) => {
    const el = document.getElementById('toast');
    el.innerHTML = innerHTML;
    el.className = 'show';
    setTimeout(() => {
      el.className = el.className.replace('show', '')
    }, 3000)
  };

  const getUploadParams = ({file, meta}) => {
    const body = new FormData();
    body.append('house_layout', file);
    body.append('house_name', houseName);
    return {url: BASE_URL + '/houses/uploadHouseLayout/5f87947e1a167b1d875e2d64', body}
  };

  const handleChangeStatus = ({meta, remove}, status, p2, p3) => {
    if (status === 'headers_received') {
      toast(`${meta.name} uploaded!`);
      refreshHouses(true);
      remove();
      onClose();
      addLog(logDispatch,`uploaded new house layout with name : ${houseName}`,"admin");
    } else if (status === 'aborted') {
      toast(`${meta.name}, upload failed...`)
    };
  };

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
        <div style={{fontFamily: "roboto"}}>
          <TextField id="outlined-basic" label="House Name" variant="outlined" value={houseName} onChange={e => {
            setHouseName(e.target.value);
          }}/>
          <Spacer v/>
          <div id="toast">Upload House Layout File</div>
          <Spacer v/>
          <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            maxFiles={1}
            multiple={false}
            canCancel={false}
            accept={".txt"}
            inputContent="Drop A File"
            styles={{
              dropzone: {width: 400, height: 200, fontFamily: "roboto"},
              dropzoneActive: {borderColor: 'green'},
            }}
          />
        </div>
      </div>
    </Modal>
  )
};

export default SingleFileAutoSubmit;