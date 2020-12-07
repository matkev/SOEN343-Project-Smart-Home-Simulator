import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import {useDashboardState} from "../../../context/DashboardContext";
import {Tab, Tabs} from "@material-ui/core";
import classNames from "classnames";
import SHCModule from "./SHCModule";
import SHPModule from "./SHPModule";
import SHHModule from "./SHHModule";

const Modules = ({setCoreChanges}) => {
  const classes = useStyle();
  const [module, setModule] = useState("SHS");
  const {activeAgentDetail, rooms} = useDashboardState();


  useEffect(() => {
    setModule()
  }, [activeAgentDetail]);

  const handleChangeTab = (e, newValue) => {
    setModule(newValue);
  };


  return (
    <div className={classes.modules}>
      <Tabs
        value={module ?? "SHS"}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
        onChange={handleChangeTab}
        aria-label="disabled tabs example"
      >

        {(!activeAgentDetail || activeAgentDetail?.accessRights.shsRights) &&
        <Tab label={"SHS"} value={"SHS"} className={classNames(classes.tab, module === "SHS" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shcRights) &&
        <Tab label={"SHC"} value={"SHC"} className={classNames(classes.tab, module === "SHC" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shpRights) &&
        <Tab label={"SHP"} value={"SHP"} className={classNames(classes.tab, module === "SHP" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shhRights) &&
        <Tab label={"SHH"} value={"SHH"} className={classNames(classes.tab, module === "SHH" && classes.tabActive)}/>}
      </Tabs>
      <div className={classes.moduleContent}>

        {module === "SHC" ?
          <SHCModule rooms={rooms} setCoreChanges={setCoreChanges}/> : 
          module === "SHP" ?
            <SHPModule classes={classes}/> :
            module === "SHH" ?
            <SHHModule rooms={rooms} setCoreChanges={setCoreChanges}/> :
            <p>to be updated...</p>}
      </div>
    </div>
  );
};

export default Modules;