import React from 'react';
import useStyle from './styles'
import Sidebar from "./components/Sidebar";
import Modules from "./components/Modules";
import LogWindow from "./components/LogWindow";
import Preview from "./components/Preview";
const DashboardPage = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Sidebar/>
      <Modules/>
      <Preview/>
      <LogWindow/>
    </div>
  );
};

export default DashboardPage;