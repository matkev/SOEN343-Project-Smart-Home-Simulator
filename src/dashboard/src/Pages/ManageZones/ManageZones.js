import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import PageTitle from "../../Components/PageTitle/PageTitle";
import NewZoneModal from "./NewZoneModal";
import ZoneDetailModal from "./ZoneDetailModal";
import {deleteZone, getZoneList} from "../../Api/api_zones";

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
  {
    name: 'Min Deg(Day)',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'Max Deg(Day)',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'View Rooms',
    options: {
      filter: false,
      sort: false,
    },
  },
];


const ManageZones = () => {


  const [zones, setZones] = useState([]);
  const [newZoneModal, setNewZoneModal] = useState(false)
  const [zoneDetailModal, setZoneDetailModal] = useState({
    open: false,
    zone: {}
  });
  const refreshZone = () => {
    getZoneList().then((data) => {
      setZones(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshZone();
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
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.name,
        data.minDeg.day,
        data.maxDeg.day,
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
      deleteZone(zones[item.dataIndex].id).then(res => {
        setZones(users => ([...users.slice(0, item.dataIndex), ...users.slice(item.dataIndex + 1)]))
      }).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateZone = (id, zone) => {
    setZoneDetailModal(modal => ({
      ...modal,
      zone: zone
    }))
    const foundZone = zones.findIndex(item => item.id === id);
    if (foundZone !== -1)
      setZones(zones => ([
        ...zones.slice(0, foundZone),
        zone, ...zones.slice(foundZone + 1)
      ]));
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
        open={zoneDetailModal.open} zone={zoneDetailModal.zone}
        updateZone={updateZone}
        onClose={() => setZoneDetailModal((modal) => ({...modal, open: false}))}/>
      <NewZoneModal
        open={newZoneModal}
        refreshUsers={refreshZone}
        onClose={() => setNewZoneModal(false)}/>
    </div>
  );
};

export default ManageZones;