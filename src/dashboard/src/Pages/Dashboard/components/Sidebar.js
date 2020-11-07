import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom'
import Clock from './Clock';
import classNames from "classnames";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {getAgentList} from "../../../Api/api_agents";
import {toast} from "react-toastify";
import {
  setActiveAgent,
  setActiveAgentDetail,
  setActiveAgentLoc,
  useDashboardDispatch,
  useDashboardState
} from "../../../context/DashboardContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";

const Sidebar = () => {
  const classes = useStyle();
  const history = useHistory();

  const dashboardDispatch = useDashboardDispatch();
  const logDispatch = useLogDispatch();
  const {activeAgent, activeAgentLoc, weather,rooms} = useDashboardState();

  const [time, setTime] = useState();
  const [agents, setAgents] = useState([]);


  const handleChangeActiveAgent = (e) => {
    if (e.target.value === "admin") {
      setActiveAgent(dashboardDispatch, "admin");
      setActiveAgentDetail(dashboardDispatch, undefined);
      localStorage.removeItem("activeAgent");
      addLog(logDispatch,"active user was changed to admin");
    } else {
      setActiveAgent(dashboardDispatch, e.target.value);
      localStorage.setItem("activeAgent", e.target.value);
      const agent = agents.find(item => item.id === e.target.value);
      setActiveAgentDetail(dashboardDispatch, agent);
      const roomId = agent?.room_id;
      const roomName = rooms.find(item => item.id === roomId)?.name;
      setActiveAgentLoc(dashboardDispatch, roomName);
      addLog(logDispatch,`active user was changed to ${agent.agentname}`);
    }
  };

  useEffect(() => {
    getAgentList().then(data => {
      setAgents(data);
    }).catch(err => {
      toast.error(err.message);
    })
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time => Math.random());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.sidebar}>
      <Typography className={classes.sidebarTitle}>Simulation</Typography>
      <Avatar src={localStorage.getItem("image")} className={classes.sidebarAvatar}/>
      <Typography className={classes.sidebarName}>{localStorage.getItem("name")}</Typography>

      {
        // activeAgent==="admin"
        true &&
        <>
          <Button className={classes.MuserBtn} disabled={activeAgent !== "admin"} color={"secondary"}
                  variant={"contained"} onClick={() => {
            history.push("/manage-agents")
          }}>Manage Agents</Button>
          <Button color={"secondary"} disabled={activeAgent !== "admin"} className={"uni_m_b_small"}
                  variant={"contained"} onClick={() => {
            history.push("/manage-house")
          }}>Manage Houselayout</Button>
        </>
      }
      <FormControl variant="outlined" className={classNames(classes.formControl, "uni_m_b_small")}>
        <InputLabel id="active-agents-label">Active Agent</InputLabel>
        <Select
          labelId="active-agents-label"
          id="active-agents"
          value={activeAgent}
          onChange={handleChangeActiveAgent}
          label="Active Agent"
        >
          <MenuItem value={"admin"}>{"admin"}</MenuItem>
          {agents.map(item => <MenuItem value={item.id}>{item.agentname}</MenuItem>)}
        </Select>
      </FormControl>
      {
        activeAgent !== "admin" &&
        <Typography className={classes.sidebarLoc}>{"Location : " + activeAgentLoc}</Typography>
      }
      <Typography className={classes.sidebarTemp}>Outside Temperature : {weather.current?.temperature}°C</Typography>
      <Clock/>
    </div>
  );
};

export default Sidebar;