import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import Sidebar from "./components/Sidebar";
import Modules from "./components/Modules";
import LogWindow from "./components/LogWindow";
import Preview from "./components/Preview";
import axios from "axios";

const DashboardPage = () => {

  const [weather, setWeather] = useState({});
  const [activeAgent, setActiveAgent] = useState("admin");
  const [activeAgentLoc, setActiveLoc] = useState("None");

  useEffect(() => {
    axios.get("http://api.weatherstack.com/current?access_key=979ac73a3d549893ef4e75fbf201d827&query=montreal")
      .then(res => {
        setWeather(res.data);
      })
      .catch(error => console.log(error))
  }, []);

  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Sidebar
        weather={weather}
        activeAgent={activeAgent}
        setActiveAgent={setActiveAgent}
        activeAgentLoc={activeAgentLoc}
        setActiveLoc={setActiveLoc}/>
      <Modules/>
      <Preview
        activeAgent={activeAgent}
        setActiveAgent={setActiveAgent}
        activeAgentLoc={activeAgentLoc}
        setActiveLoc={setActiveLoc}/>
      <LogWindow/>
    </div>
  );
};

export default DashboardPage;