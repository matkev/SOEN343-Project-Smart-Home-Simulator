import React, {useEffect} from 'react';
import useStyle from './styles'
import Sidebar from "./components/Sidebar";
import Modules from "./components/Modules";
import LogWindow from "./components/LogWindow";
import Preview from "./components/Preview";
import axios from "axios";
import {setRooms, setWeather, useDashboardDispatch} from "../../context/DashboardContext";
import {getRoomList} from "../../Api/api_room";
import {toast} from "react-toastify";

const makeArr = (size, autoMode) => {
  const states = ['on', 'off'];
  if (autoMode)
    states.push("auto");
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(states[Math.floor(Math.random() * states.length)])
  }
  return arr;
};

const DashboardPage = () => {

  const dashboardDispatch = useDashboardDispatch();

  useEffect(() => {
    axios.get("http://api.weatherstack.com/current?access_key=979ac73a3d549893ef4e75fbf201d827&query=montreal")
      .then(res => {
        setWeather(dashboardDispatch, res.data);
      })
      .catch(error => console.log(error))
  }, []);

  const transformRooms = (rooms) => {
    return rooms.map(item => ({...item, lights: makeArr(item.lights, true)}))
  };

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(dashboardDispatch, transformRooms(data));
    }).catch(err => {
      console.log(err);
      toast.error(err.message);
    })
  }, []);

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