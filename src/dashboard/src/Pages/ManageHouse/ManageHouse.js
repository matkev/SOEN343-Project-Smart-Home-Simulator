import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import RoomModal from "./RoomModal";
import PageTitle from "../../Components/PageTitle";
import {deleteRoom, getRoomList} from "../../Api/api_room";
import {getHouseList} from "../../Api/api_house";
import SingleFileAutoSubmit from "./SingleFileAutoSubmit";
import {deleteAgent} from "../../Api/api_agents";

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


  const [house, setHouse] = useState({});
  const [houseLayout, setHouseLayout] = useState([]);
  const [uploadHouseLayoutModal, setUploadHouseLayoutModal] = useState(false)
  const [roomModal, setRoomModal] = useState({
    open: false,
    room: {}
  });

  const refreshHouse = () => {
    getHouseList().then(payload => {
      if (payload && payload.length < 1)
        return toast.warning("please upload House Layout First");
      setHouse(payload[payload.length - 1]);
    }).catch(err => {
      toast.error(err.message);
    })
  };

  useEffect(() => {
    refreshHouse()
  }, []);

  useEffect(() => {
    if (house.id)
      getRoomList(house.id).then(data => {
        setHouseLayout(data);
      }).catch(err => toast.error(err.message))
  }, [house]);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };
  const handleManage = (e, room) => {
    e.stopPropagation();
    setRoomModal(modal => ({...modal, open: true, room}))
  };
  const setRoomClick = (room) => {
    console.log("room", room);
    const foundRoom = houseLayout.find(item => item.name === room);
    console.log("foundRoom", foundRoom);
    if (foundRoom)
      setRoomModal((modal) => ({...modal, room: foundRoom}))
  };


  const onRowsDelete = (row, datas) => {
    console.log(row.data);
    console.log(datas);
    row.data.forEach(item => {
      deleteRoom(houseLayout[item.dataIndex].id).catch(err=>{
        toast.error(err.message)
      })
    })
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
      <PageTitle title={house.name || "Manage House"} button={"Upload House Layout"}
                 onClickButton={() => setUploadHouseLayoutModal(true)}/>
      <MUIDataTable
        title={'House List'}
        data={transformData(houseLayout)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete
        }}
      />
      <RoomModal open={roomModal.open} room={roomModal.room}
                 onClose={() => setRoomModal((modal) => ({...modal, open: false}))} setRoom={setRoomClick}/>
      <SingleFileAutoSubmit open={uploadHouseLayoutModal}
                            onClose={() => setUploadHouseLayoutModal(() => false)}
                            refreshHouses={refreshHouse}
      />
    </div>
  )
    ;
};

export default ManageHouse;