import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import RoomModal from "./RoomModal";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {deleteRoom, getRoomList} from "../../Api/api_rooms";
import {getHouseList} from "../../Api/api_houses";


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

  const refreshHouse = (saveLastIdToLocalStorage) => {
    getHouseList().then(payload => {
      const house = payload.find(item => item.id === localStorage.getItem("houseId"));
      if (!payload || payload.length < 1) {
        return toast.warning("please upload new House Layout then login");
      }
      if (saveLastIdToLocalStorage) {
        setHouse(payload[payload.length - 1]);
        localStorage.setItem("houseId", payload[payload.length - 1].id);
      } else
        setHouse(house);
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
      <PageTitle title={house.name || "Manage House Layout"} />
      <MUIDataTable
        title={'Room List'}
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
    </div>
  )
    ;
};

export default ManageHouseLayout;