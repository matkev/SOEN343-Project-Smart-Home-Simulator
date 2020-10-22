import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import SimContextDetailModal from "./SimContextDetailModal";
import PageTitle from "../../Components/PageTitle/PageTitle";
import NewSimContextModal from "./NewSimContextModal";
import {deleteSimContext, getSimContextList} from "../../Api/api_simContexts";

const columns = [
  {
    name: 'No.',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'lastDate',
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
    name: 'View Profile',
    options: {
      filter: false,
      sort: false,
    },
  },
];


const ManageSimContexts = () => {


  const [simContexts, setSimContexts] = useState([]);
  const [newSimContextModal, setNewSimContextModal] = useState(false)
  const [simContextDetailModal, setSimContextDetailModal] = useState({
    open: false,
    simContext: {}
  });
  const refreshSimContexts = () => {
    getSimContextList().then((data) => {
      setSimContexts(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshSimContexts();
  }, []);

  const onItemClick = (rowData, index) => {
  };
  const handleManage = (e, simContext) => {
    e.stopPropagation();
    setSimContextDetailModal(modal => ({...modal, open: true, simContext}))
  };

  const newSimContextClick = () => {
    setNewSimContextModal(true);
  };


  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.lastDate,
        data.id,
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleManage(e, data)}
        >
          Manage
        </Button>,
      ]);

  };

  const onRowsDelete = (row, datas) => {
    console.log(row.data);
    console.log(datas);
    row.data.forEach(item => {
      deleteSimContext(simContexts[item.dataIndex].id).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateSimContext = (id, simContext) => {
    setSimContextDetailModal(modal => ({
      ...modal,
      simContext: simContext
    }))
    const foundSimContext = simContexts.findIndex(item => item.id === id);
    console.log(id, simContext, foundSimContext);
    if (foundSimContext !== -1)
      setSimContexts(simContexts => ([
        ...simContexts.slice(0, foundSimContext),
        simContext, ...simContexts.slice(foundSimContext + 1)
      ]));
  };

  const classes = useStyle();
  console.log(simContexts);
  return (
    <div>
      <PageTitle title={"Manage SimContexts"} button={"New SimContext"} onClickButton={newSimContextClick}/>
      <MUIDataTable
        title={'SimContext List'}
        data={transformData(simContexts)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete: onRowsDelete
        }}
      />
      <SimContextDetailModal open={simContextDetailModal.open} simContext={simContextDetailModal.simContext}
                       updateSimContext={updateSimContext}
                       onClose={() => setSimContextDetailModal((modal) => ({...modal, open: false}))}/>
      <NewSimContextModal open={newSimContextModal}
                    refreshSimContexts={refreshSimContexts}
                    onClose={() => setNewSimContextModal(false)}/>
    </div>
  )
    ;
};

export default ManageSimContexts;