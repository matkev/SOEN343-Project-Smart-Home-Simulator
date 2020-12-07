import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {deleteAgent, getAgentList} from "../../Api/api_agents";
import NewAgentModal from "./NewAgentModal";
import AgentDetailModal from "./AgentDetailModal";
import {getRoomList} from "../../Api/api_rooms";

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
    name: 'Location',
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


  const [agents, setAgents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newAgentModal, setNewAgentModal] = useState(false)
  const [agentDetailModal, setAgentDetailModal] = useState({
    open: false,
    user: {}
  });
  const refreshAgents = () => {
    getAgentList(localStorage.getItem("houseId")).then((data) => {
      setAgents(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshAgents();
  }, []);
  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then((data) => {
      setRooms(data);
    }).catch(err => {
      toast.error(err.message);
    });
  }, []);

  const onItemClick = (rowData, index) => {
  };
  const handleManage = (e, user) => {
    e.stopPropagation();
    setAgentDetailModal(modal => ({...modal, open: true, user}))
  };

  const newAgentClick = () => {
    setNewAgentModal(true);
  };


  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.agentname,
        rooms.find(item => item.id === data.room_id)?.name || "undefined",
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
    row.data.forEach(item => {
      deleteAgent(agents[item.dataIndex].id).then(res => {
        setAgents(users => ([...users.slice(0, item.dataIndex), ...users.slice(item.dataIndex + 1)]))
      }).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateUser = (id, agent) => {
    setAgentDetailModal(modal => ({
      ...modal,
      user: agent
    }))
    const foundAgent = agents.findIndex(item => item.id === id);
    console.log(id, agent, foundAgent);
    if (foundAgent !== -1)
      setAgents(users => ([
        ...users.slice(0, foundAgent),
        agent, ...users.slice(foundAgent + 1)
      ]));
  };

  return (
    <div>
      <PageTitle title={"Manage Agents"} button={"New Agent"} onClickButton={newAgentClick}/>
      <MUIDataTable
        title={'Agent List'}
        data={transformData(agents)}
        columns={columns}
        options={{
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
          onRowsDelete: onRowsDelete
        }}
      />
      <AgentDetailModal open={agentDetailModal.open} user={agentDetailModal.user}
                        updateUser={updateUser}
                        onClose={() => setAgentDetailModal((modal) => ({...modal, open: false}))}/> <NewAgentModal
      open={newAgentModal}
      refreshUsers={refreshAgents}
      onClose={() => setNewAgentModal(false)}/>
    </div>
  );
};

export default ManageAgents;