import React, {useEffect, useState, useRef} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import PageTitle from "../../Components/PageTitle/PageTitle";
import NewZoneModal from "./NewZoneModal";
import ZoneDetailModal from "./ZoneDetailModal";
import {deleteZone, getZoneList, patchZone, createNewZone} from "../../Api/api_zones";
import { getRoomList, patchRoom} from '../../Api/api_rooms';
import { adaptZone, adaptZones, getListOfAdaptedZones } from './ZoneConverter';


const pCols=[1,2,3].map(periodColumn);
const columns = [
  {
    name: 'No.',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'Name',
    options: {
      filter: false,
      sort: true,
    },
  },
  ...pCols[0],
  ...pCols[1],
  ...pCols[2],
  {
    name: 'View Rooms',
    options: {
      filter: false,
      sort: false,
    },
  },
];
function periodColumn(number){
  return [{
    name: `Period #${number} Temp`,
    options: {
      filter: false,
      sort: false,
    }
  },{
    name: `Period #${number} Start`,
    options: {
      filter: false,
      sort: false,
    }
  }];
}

const ManageZones = () => {


  const [zones, setZones] = useState([]);
  const [newZoneModal, setNewZoneModal] = useState(false)
  const newZoneRef = useRef(newZoneModal);
  const [zoneDetailModal, setZoneDetailModal] = useState({
    open: false,
    zone: {rooms:[], periods:[{},{},{}]}
  });
  const [rooms, setRooms] = useState([{}]);

  const refreshZone = () => {
    getZoneList().then((data) => {
      const houseData = data.filter((d) => d.house_id == localStorage.getItem("houseId"));
      setZones(houseData);
    }).catch(err => {
      toast.error(err.message);
    });
  }
  const refreshRooms = () => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }
  useEffect(() => {
    newZoneRef.current = newZoneModal;
  }, [newZoneModal]);

  useEffect(() => {
    refreshZone();
    refreshRooms();
  }, []);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };
  const handleManage = (e, zone) => {
    e.stopPropagation();
    setZoneDetailModal(modal => ({...modal, open: true, zone}))
  };

  const newZoneClick = () => {
    setNewZoneModal(true);
  };

  const transformData = dataArg => {
    function timeOf(time){
      if (time){
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
    }

    return dataArg.map((data, index) =>
      [
        index + 1,
        data.name,
        data.periods[0]?.temperatureSetting,
        timeOf(parseInt(data.periods[0]?.startTime)),
        data.periods[1]?.temperatureSetting,
        timeOf(parseInt(data.periods[1]?.startTime)),
        data.periods[2]?.temperatureSetting,
        timeOf(parseInt(data.periods[2]?.startTime)),
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleManage(e, data)}
        >
          Rooms
        </Button>,
      ]);

  };

  const onRowsDelete = (row, datas) => {
    row.data.forEach(item => {
      const zoneDel = zones[item.dataIndex];
      //set the zone of rooms to zone 1
      getListOfAdaptedZones(rooms).then((data) => {
        let zone1 = data.find((zone)=> zone.name === "Zone 1");
        data.find((zone)=> zone.id === zoneDel.id).rooms.forEach((removedRoomId)=>{
          //if zone1 doesn't exist, then create it.
          if (zone1 === undefined){
            zone1 = createNewZone(makeNewZone("Zone 1")).then((zoneOne)=>{
              //set the room's zone to zone1
              updateDBRoomZone(removedRoomId, zoneOne.id);
              refreshZone();
              return zoneOne;
            }).catch(err => {
              toast.error(err.message);
            });
          }
          else{
            //set the room's zone to zone1
            updateDBRoomZone(removedRoomId, zone1.id);
          }
        });
      });
      deleteZone(zones[item.dataIndex].id).then(res => {
        //remove zone
        setZones(users => ([...users.slice(0, item.dataIndex), ...users.slice(item.dataIndex + 1)]));
      }).catch(err => {
        toast.error(err.message)
      });
    });
  };

  const updateZone = (id, zone) => {
    setZoneDetailModal(modal => ({
      ...modal,
      zone: zone
    }));
    const foundZone = zones.findIndex(item => item.id === id);
    if (foundZone !== -1){
      setZones(zones => ([
        ...zones.slice(0, foundZone),
        zone, 
        ...zones.slice(foundZone + 1)
      ]));
    }
  };


  function makeNewZone(name){
    const newZone = {
      house_id: localStorage.getItem("houseId"),
      name: name,
      periods: [makePeriod({}),{},{}]
    }
    return newZone;
  }
  function makePeriod({temp, hours, minutes, seconds}){
    return {
      temperatureSetting: temp ?? 0, 
      startTime: makeDate({hours: hours, minutes: minutes, seconds:seconds})
    };
  }
  function makeDate({hours, minutes, seconds}){
    const date = new Date();
    date.setHours(  hours   ?? 0);
    date.setMinutes(minutes ?? 0);
    date.setSeconds(seconds ?? 0);
    return date;
  }

  const updateDBZone = (newZone) => {
    getZoneList().then((data) => {
      const adaptedData = adaptZones(data, rooms);
      const oldZone = data.find((zone)=> zone.id === newZone.id);
      const adaptedOldZone = adaptZone(oldZone, rooms);
      let zone1 = adaptedData.find((zone)=> zone.name === "Zone 1");
      if (adaptedOldZone !== undefined){
        if (newZone.rooms !== undefined){
          //update the rooms to match the zone.
          const separator = "__";
          const totalRooms = Array.from(new Set([...adaptedOldZone.rooms, separator ,...newZone.rooms]));
          const affectedRooms = totalRooms.filter((room)=> !adaptedOldZone.rooms.includes(room) || !newZone.rooms.includes(room));
  
          const indexToSplit = affectedRooms.indexOf(separator);
          const oldRoomsToExclude = affectedRooms.slice(0, indexToSplit);
          const newRoomsToInclude = affectedRooms.slice(indexToSplit + 1);
  
          //exclude old room in zone
          oldRoomsToExclude.forEach((excludedRoomId)=>{
            //if zone1 doesn't exist, then create it.
            if (zone1 === undefined){
              zone1 = createNewZone(makeNewZone("Zone 1")).then((zoneOne)=>{
                //set the room's zone to zone1
                updateDBRoomZone(excludedRoomId, zoneOne.id);
                refreshZone();
                return zoneOne;
              }).catch(err => {
                toast.error(err.message);
              });
            }
            else{
              //set the room's zone to zone1
              updateDBRoomZone(excludedRoomId, zone1.id);
            }
          });
  
          //include new room in zone
          newRoomsToInclude.forEach((includedRoomId)=>{
            updateDBRoomZone(includedRoomId, newZone.id);
          });
        }

        //update the zone model.
        const tempZone = {...newZone};
        delete tempZone.rooms;
        patchZone(newZone.id, {...oldZone, ...tempZone}).catch(err => {
          toast.error(err.message);
        });
      }
    }).catch(err => {
      toast.error(err.message);
    });
  };

  const updateDBRoomZone = (newRoomId, zoneId)=>{
    getRoomList(localStorage.getItem("houseId")).then((data) => {
      const oldRoom = data.find((room)=> room.id === newRoomId);
      if (oldRoom !== undefined){
        patchRoom(newRoomId, {...oldRoom, zone_id: zoneId}).catch(err => {
          toast.error(err.message);
        });;
      }
    }).catch(err => {
      toast.error(err.message);
    });
  };

  const classes = useStyle();
  return (
    <div>
      <PageTitle title={"Manage Zones"} button={"New Zone"} onClickButton={newZoneClick}/>
      <MUIDataTable
        title={'Zone List'}
        data={transformData(zones)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
          onItemClick(rowData, meta.dataIndex),
          onRowsDelete: onRowsDelete
        }}
      />
      <ZoneDetailModal
        open={zoneDetailModal.open} 
        zone={zoneDetailModal.zone}
        updateZone={updateZone}
        onClose={() => {
          setZoneDetailModal((modal) => ({...modal, open: false}));
          updateDBZone(zoneDetailModal.zone);
        }}
      />
      <NewZoneModal
        open={newZoneModal}
        refreshZones={refreshZone}
        onClose={() => setNewZoneModal(false)}
      />
    </div>
  );
};

export default ManageZones;