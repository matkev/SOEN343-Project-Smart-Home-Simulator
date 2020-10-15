import React from 'react';
import Dropzone from "react-dropzone-uploader";
import Spacer from "./Spacer";

const SingleFileAutoSubmit = () => {
  const toast = (innerHTML) => {
    const el = document.getElementById('toast')
    el.innerHTML = innerHTML
    el.className = 'show'
    setTimeout(() => {
      el.className = el.className.replace('show', '')
    }, 3000)
  }

  const getUploadParams = () => {
    return {url: 'https://httpbin.org/post'}
  }

  const handleChangeStatus = ({meta, remove}, status) => {
    if (status === 'headers_received') {
      toast(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      toast(`${meta.name}, upload failed...`)
    }
  }

  return (
    <div style={{fontFamily : "roboto"}}>
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
          dropzone: {width: 400, height: 200 , fontFamily : "roboto"},
          dropzoneActive: {borderColor: 'green'},
        }}
      />
    </div>
  )
}

export default SingleFileAutoSubmit;