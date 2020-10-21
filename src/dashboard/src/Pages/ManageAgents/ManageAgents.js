import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import UserDetailModal from "./AgentDetailModal";
import PageTitle from "../../Components/PageTitle";
import {deleteAgent, getAgentList} from "../../Api/api_agents";
import NewAgentModal from "./NewAgentModal";

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
    name: 'View Profile',
    options: {
      filter: false,
      sort: false,
    },
  },
];


const ManageAgents = () => {


  const [users, setUsers] = useState([]);
  const [newAgentModal, setNewAgentModal] = useState(false)
  const [userDetailModal, setAgentDetailModal] = useState({
    open: false,
    user: {}
  });
  const refreshAgents = () => {
    getAgentList().then((data) => {
      setUsers(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshAgents();
  }, []);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };
  const handleManage = (e, user) => {
    e.stopPropagation();
    setUserDetailModal(modal => ({...modal, open: true, user}))
  };

  const newUserClick = () => {
    setNewAgentModal(true);
  };


  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.agentname,
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
      deleteAgent(users[item.dataIndex].id).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateUser = (id, agent) => {
    setUserDetailModal(modal => ({
      ...modal,
      user: agent
    }))
    const foundAgent = users.findIndex(item => item.id === id);
    console.log(id, agent, foundAgent);
    if (foundAgent !== -1)
      setUsers(users => ([
        ...users.slice(0, foundAgent),
        agent, ...users.slice(foundAgent + 1)
      ]));
  };

  const classes = useStyle();
  console.log(users);
  return (
    <div>
      <PageTitle title={"Manage Users"} button={"New User"} onClickButton={newUserClick}/>
      <MUIDataTable
        title={'User List'}
        data={transformData(users)}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete: onRowsDelete
        }}
      />
      <UserDetailModal open={userDetailModal.open} user={userDetailModal.user}
                       updateUser={updateUser}
                       onClose={() => setUserDetailModal((modal) => ({...modal, open: false}))}/>
      <NewAgentModal open={NewAgentModal}
                     refreshUsers={refreshAgents}
                     onClose={() => setNewAgentModal(false)}/>
    </div>
  )
    ;
};

export default ManageAgents;