import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import useStyle from './styles'
import MUIDataTable from 'mui-datatables'
import {toast} from "react-toastify";
import {getUserList} from "../../Api/api_users";
import Button from "@material-ui/core/Button";
import UserDetailModal from "../UserDetail/UserDetailModal";

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
    name: 'Manage',
    options: {
      filter: false,
      sort: false,
    },
  },
];


const ManageUsers = () => {


  const [users, setUsers] = useState([]);
  const [userDetailModal, setUserDetailModal] = useState({
    open: false,
    user: {}
  });

  useEffect(() => {
    getUserList((isOk, payload) => {
      if (isOk)
        setUsers(transformData(payload));
      else toast.error(payload);
    })
  }, []);

  const onItemClick = (rowData, index) => {
    toast.info("item " + index + " clicked")
  };
  const handleManage = (e, user) => {
    e.stopPropagation();
    setUserDetailModal(modal => ({...modal, open: true, user}))
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
      <Typography className={classes.title}>Manage Users</Typography>
      <MUIDataTable
        title={'User List'}
        data={users}
        columns={columns}
        options={{
          // filterType: 'checkbox',
          onRowClick: (rowData, meta) =>
            onItemClick(rowData, meta.dataIndex),
        }}
      />
      <UserDetailModal open={userDetailModal.open} user={userDetailModal.user}
                       onClose={() => setUserDetailModal((modal) => ({...modal, open: false}))}/>
    </div>
  )
    ;
};

export default ManageUsers;