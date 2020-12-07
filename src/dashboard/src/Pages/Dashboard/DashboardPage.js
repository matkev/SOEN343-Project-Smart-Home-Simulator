import React, {useEffect, useState} from 'react';
import useStyle from './styles'
import Sidebar from "./sidebar/Sidebar";
import Modules from "./module/Modules";
import LogWindow from "./log/LogWindow";
import Preview from "./preview/Preview";
import axios from "axios";
import {setRooms, setWeather, useDashboardDispatch} from "../../context/DashboardContext";
import {toast} from "react-toastify";
import {getRoomList} from "../../Api/api_rooms";

const DashboardPage = () => {

  const dashboardDispatch = useDashboardDispatch();
  const [coreChanges, setCoreChanges] = useState(false);

  useEffect(() => {
    function updateWeather(){
      axios.get("http://api.weatherstack.com/current?access_key=979ac73a3d549893ef4e75fbf201d827&query=montreal")
        .then(res => {
          if (res.data.current !== undefined){
            setWeather(dashboardDispatch, res.data);
          }
          else{
            //if the weather is unavailable, try again later.
            setTimeout(updateWeather, 5000);
          }
        }).catch(error => console.log(error));
    }

    updateWeather();
  }, []);

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(dashboardDispatch, data);
    }).catch(err => {
      toast.error(err.message);
    })
  }, []);

  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Sidebar/>
      <Modules setCoreChanges={setCoreChanges}/>
      <Preview coreChanges={coreChanges} setCoreChanges={setCoreChanges}/>
      <LogWindow/>
    </div>
  );
};

export default DashboardPage;