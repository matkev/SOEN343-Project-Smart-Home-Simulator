import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {deleteHouse, getHouseList} from "../../Api/api_houses";
import {useHistory} from 'react-router-dom'
import SingleFileAutoSubmit from "./SingleFileAutoSubmit";


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
    name: 'ID',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'View Dashboard',
    options: {
      filter: false,
      sort: false
    }
  }
];


const ManageHouses = () => {

  const history = useHistory();
  const [houses, setHouses] = useState([]);
  const [uploadHouseLayoutModal, setUploadHouseLayoutModal] = useState(false)

  const refreshHouses = () => {
    getHouseList(localStorage.getItem("userId")).then((data) => {
      setHouses(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshHouses();
  }, []);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };


  const handleSimulate = (e, house) => {
    localStorage.setItem("houseId", house.id);
    history.push("/");
  }


  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.name,
        data.id,
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleSimulate(e, data)}
        >
          Simulate
        </Button>,
      ]);

  };

  const onRowsDelete = (row, datas) => {
    row.data.forEach(item => {
      deleteHouse(houses[item.dataIndex].id).then(res=>{
        setHouses(houses=>([...houses.slice(0,item.dataIndex),...houses.slice(item.dataIndex+1)]))
      }).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateHouse = (id, house) => {
    // setHouseDetailModal(modal => ({
    //   ...modal,
    //   house: house
    // }))
    const foundHouse = houses.findIndex(item => item.id === id);
    console.log(id, house, foundHouse);
    if (foundHouse !== -1)
      setHouses(houses => ([
        ...houses.slice(0, foundHouse),
        house, ...houses.slice(foundHouse + 1)
      ]));
  };

  const classes = useStyle();
  return (
    <div>
      <PageTitle title={"Manage Houses"} button={"Upload House Layout"}
                 onClickButton={() => setUploadHouseLayoutModal(true)}/>
      <MUIDataTable
        title={'House List'}
        data={transformData(houses)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete: onRowsDelete
        }}
      />
      <SingleFileAutoSubmit open={uploadHouseLayoutModal}
                            onClose={() => setUploadHouseLayoutModal(() => false)}
                            refreshHouses={refreshHouses}
      />
    </div>
  )
    ;
};

export default ManageHouses;