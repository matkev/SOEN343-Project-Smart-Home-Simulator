import React, {useState} from 'react';
import useStyle from '../styles'
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import classNames from 'classnames';

const Modules = () => {
  const classes = useStyle();
  const [module,setModule] = useState("SHS");

  const handleChangeTab = (e, newValue) => {
    setModule(newValue);
  };
  return (
    <div className={classes.modules}>
      <Tabs
        value={module}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
        onChange={handleChangeTab}
        aria-label="disabled tabs example"
      >
        <Tab label={"SHS"} value={"SHS"} className={classNames(classes.tab, module==="SHS" && classes.tabActive)}/>
        <Tab label={"SHC"} value={"SHC"} className={classNames(classes.tab, module==="SHC" && classes.tabActive)}/>
        <Tab label={"SHP"} value={"SHP"} className={classNames(classes.tab, module==="SHP" && classes.tabActive)}/>
        <Tab label={"SHH"} value={"SHH"} className={classNames(classes.tab, module==="SHH" && classes.tabActive)}/>
      </Tabs>
      <div className={classes.moduleContent}>
          <div className={classes.moduleBox}>
            <div className={classes.moduleBoxHeader}>Item</div>
            <ul>
              <li>Windows</li>
              <li>Lights</li>
              <li>Doors</li>
            </ul>
          </div>
          <div className={classes.moduleBox}>
            <div className={classes.moduleBoxHeader}>Open/Close</div>
            <ul>
              <li>Backyard</li>
              <li>Garage</li>
              <li>Main</li>
            </ul>
          </div>
      </div>
    </div>
  );
};

export default Modules;