import React from 'react';
import {Link} from "react-router-dom";

const DashboardPage = () => {
  return (
    <div>
      dashboard
        <Link to={"/manage-user"}>ManageUsers</Link>
    </div>
  );
};

export default DashboardPage;