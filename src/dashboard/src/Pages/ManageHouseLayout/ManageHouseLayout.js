import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import RoomModal from "./RoomModal";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {deleteRoom, getRoomList} from "../../Api/api_rooms";


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


const ManageHouseLayout = () => {


  const [house, setHouse] = useState({});
  const [houseLayout, setHouseLayout] = useState([]);
  const [roomModal, setRoomModal] = useState({
    open: false,
    room: {}
  });

  const refreshHouse = () => {
    getRoomList(localStorage.getItem("houseId")).then((data) => {
      setHouseLayout(data);
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
  };
  const handleManage = (e, room) => {
    e.stopPropagation();
    setRoomModal(modal => ({...modal, open: true, room}))
  };
  const setRoomClick = (room) => {
    const foundRoom = houseLayout.find(item => item.name === room);
    if (foundRoom)
      setRoomModal((modal) => ({...modal, room: foundRoom}))
  };


  const onRowsDelete = (row, datas) => {
    row.data.forEach(item => {
      deleteRoom(houseLayout[item.dataIndex].id).then(res => {
        setHouseLayout(rooms => ([...rooms.slice(0, item.dataIndex), ...rooms.slice(item.dataIndex + 1)]))
      }).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.name,
        data.windows.length,
        data.lights.length,
        data.doors.length,
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
      <PageTitle title={house.name || "Manage House Layout"} />
      <MUIDataTable
        title={'Room List'}
        data={transformData(houseLayout)}
        columns={columns}
        options={{
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete
        }}
      />
      <RoomModal open={roomModal.open} room={roomModal.room}
                 onClose={() => setRoomModal((modal) => ({...modal, open: false}))} setRoom={setRoomClick}/>
    </div>
  )
    ;
};

export default ManageHouseLayout;