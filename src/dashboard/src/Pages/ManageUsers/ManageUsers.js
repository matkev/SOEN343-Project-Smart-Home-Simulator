import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {deleteUser, getUserList} from "../../Api/api_users";
import NewUserModal from "./NewUserModal";
import UserDetailModal from "./UserDetailModal";
import {useHistory} from 'react-router-dom'


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
  {
    name: 'Login',
    options: {
      filter: false,
      sort: false
    }
  }
];


const ManageUsers = () => {

  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false)
  const [userDetailModal, setUserDetailModal] = useState({
    open: false,
    user: {}
  });
  const refreshUsers = () => {
    getUserList().then((data) => {
      setUsers(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }

  useEffect(() => {
    refreshUsers();
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

  const handleLogin = (e, user) => {
    localStorage.setItem("userId", user.id);
    history.push("/manage-houses");
  }


  const transformData = dataArg => {
    return dataArg.map((data, index) =>
      [
        index + 1,
        data.username,
        data.id,
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleManage(e, data)}
        >
          View
        </Button>,
        <Button
          color="secondary"
          size="small"
          variant="contained"
          onClick={(e) => handleLogin(e, data)}
        >
          Login
        </Button>,
      ]);

  };

  const onRowsDelete = (row, datas) => {
    console.log(row.data);
    console.log(datas);
    row.data.forEach(item => {
      deleteUser(users[item.dataIndex].id).then(res=>{
        setUsers(users=>([...users.slice(0,item.dataIndex),...users.slice(item.dataIndex+1)]))
      }).catch(err => {
        toast.error(err.message)
      })
    })
  };

  const updateUser = (id, user) => {
    setUserDetailModal(modal => ({
      ...modal,
      user: user
    }))
    const foundUser = users.findIndex(item => item.id === id);
    console.log(id, user, foundUser);
    if (foundUser !== -1)
      setUsers(users => ([
        ...users.slice(0, foundUser),
        user, ...users.slice(foundUser + 1)
      ]));
  };

  const classes = useStyle();
  console.log(users);
  return (
    <div>
      <PageTitle title={"Login"} button={"New User"} onClickButton={newUserClick}/>
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
      <NewUserModal open={newUserModal}
                     refreshUsers={refreshUsers}
                     onClose={() => setNewUserModal(false)}/>
    </div>
  )
    ;
};

export default ManageUsers;