import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import {getUserList} from "../../Api/api_users";
import Button from "@material-ui/core/Button";
import UserDetailModal from "../UserDetail/UserDetailModal";
import PageTitle from "../../Components/PageTitle";
import NewUserModal from "./NewUserModal";

const columns = [
  {
    name: 'No.',
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
    name: 'Name',
    options: {
      filter: false,
      sort: true,
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


const ManageUsers = () => {


  const [users, setUsers] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false)
  const [userDetailModal, setUserDetailModal] = useState({
    open: false,
    user: {}
  });

  useEffect(() => {
    getUserList((isOk, payload) => {
      if (isOk)
        setUsers(payload);
      else toast.error(payload);
    })
  }, []);

  const onItemClick = (rowData, index) => {
    // toast.info("item " + index + " clicked")
  };
  const handleManage = (e, user) => {
    e.stopPropagation();
    setUserDetailModal(modal => ({...modal, open: true, user}))
  };

  const newUserClick = () => {
    setNewUserModal(true);
  };

  const addUser=(newUser)=>{
    setNewUserModal(false);
    console.log(newUser,users);
    setUsers(users=>([...users,newUser]))
  };

  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.ID,
        data.Name,
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
  const classes = useStyle();
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
        }}
      />
      <UserDetailModal open={userDetailModal.open} user={userDetailModal.user}
                       onClose={() => setUserDetailModal((modal) => ({...modal, open: false}))}/>
      <NewUserModal open={newUserModal}
                    addUser={addUser}
                       onClose={() => setNewUserModal(false)}/>
    </div>
  )
    ;
};

export default ManageUsers;