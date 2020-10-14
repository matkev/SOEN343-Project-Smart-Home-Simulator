import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import {getHouseLayout} from "../../Api/api_house";
import RoomModal from "./RoomModal";
import PageTitle from "../../Components/PageTitle";
import UploadHouseLayoutModal from "./UploadHouseLayoutModal";

const columns = [
  {
    name: 'NO.',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'NAME',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'WINDOWS COUNT',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'LIGHT COUNT',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'DOORS COUNT',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'View',
    options: {
      filter: false,
      sort: false,
    },
  },
];


const ManageHouse = () => {


  const [houseLayout, setHouseLayout] = useState([]);
  const [uploadHouseLayoutModal, setUploadHouseLayoutModal] = useState(false)
  const [roomModal, setRoomModal] = useState({
    open: false,
    room: {}
  });

  useEffect(() => {
    getHouseLayout((isOk, payload) => {
      if (isOk)
        setHouseLayout(payload.roomLayouts);
      else toast.error(payload);
    })
  }, []);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };
  const handleManage = (e, room) => {
    e.stopPropagation();
    setRoomModal(modal => ({...modal, open: true, room}))
  };
  const setRoomClick = (room)=>{
    console.log("room",room);
    const foundRoom = houseLayout.find(item=>item.name===room);
    console.log("foundRoom",foundRoom);
    if(foundRoom)
      setRoomModal((modal)=>({...modal,room:foundRoom}))
  };

  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.name,
        data.windows,
        data.lights,
        data.doorsTo.length,
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleManage(e, data)}
        >
          View
        </Button>,
      ]);
  };
  const classes = useStyle();
  return (
    <div>
      <PageTitle title={"Manage House"} button={"Upload House Layout"}
                 onClickButton={() => setUploadHouseLayoutModal(true)}/>
      <MUIDataTable
        title={'House List'}
        data={transformData(houseLayout)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
        }}
      />
      <RoomModal open={roomModal.open} room={roomModal.room}
                 onClose={() => setRoomModal((modal) => ({...modal, open: false}))} setRoom={setRoomClick}/>
      <UploadHouseLayoutModal open={uploadHouseLayoutModal}
                              onClose={() => setUploadHouseLayoutModal(() => false)}/>
    </div>
  )
    ;
};

export default ManageHouse;