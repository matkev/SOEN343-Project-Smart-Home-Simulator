import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom'
import classNames from "classnames";
import MenuItem from "@material-ui/core/MenuItem";
import {getAgentList} from "../../../Api/api_agents";
import {Edit as EditIcon} from "@material-ui/icons"
import {toast} from "react-toastify";
import {
  setActiveAgent,
  setActiveAgentDetail,
  setActiveAgentLoc,
  useDashboardDispatch,
  useDashboardState
} from "../../../context/DashboardContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Clock from "./Clock";
import ChangeTemperatureDialog from "./ChangeTemperatureDialog";
import IconButton from "@material-ui/core/IconButton";
import ValueController from "./ValueController";


const Sidebar = () => {
  const classes = useStyle();
  const history = useHistory();

  const dashboardDispatch = useDashboardDispatch();
  const logDispatch = useLogDispatch();
  const {activeAgent, activeAgentLoc, weather, rooms} = useDashboardState();

  const [time, setTime] = useState();
  const [temp, setTemp] = useState("");
  const [openTemperatureDialog, setOpenTemperatureDialog] = useState();
  const [agents, setAgents] = useState([]);
  const [speed, setSpeed] = useState();

  const handleChangeActiveAgent = (e) => {
    if (e.target.value ===localStorage.getItem("username")) {
      setActiveAgent(dashboardDispatch, localStorage.getItem("username"));
      setActiveAgentDetail(dashboardDispatch, undefined);
      localStorage.removeItem("activeAgent");
      addLog(logDispatch, `active user was changed to ${localStorage.getItem("username")}`);
    } else {
      setActiveAgent(dashboardDispatch, e.target.value);
      localStorage.setItem("activeAgent", e.target.value);
      const agent = agents.find(item => item.id === e.target.value);
      setActiveAgentDetail(dashboardDispatch, agent);
      const roomId = agent?.room_id;
      const roomName = rooms.find(item => item.id === roomId)?.name;
      setActiveAgentLoc(dashboardDispatch, roomName);
      addLog(logDispatch, `active user was changed to ${agent.agentname}`);
    }
  };

  useEffect(() => {
    getAgentList(localStorage.getItem("houseId")).then(data => {
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
      <Typography className={classes.sidebarName}>{localStorage.getItem("username")}</Typography>
      <Button className={classes.MuserBtn} disabled={activeAgent !== localStorage.getItem("username")} color={"secondary"}
              variant={"contained"} onClick={() => {
        history.push("/manage-agents")
      }}>Manage Agents</Button>
      < Button color={"secondary"} disabled={activeAgent !== localStorage.getItem("username")} className={"uni_m_b_small"}
               variant={"contained"} onClick={() => {
        history.push("/manage-house-layout")
      }}>Manage Houselayout</Button>
      <FormControl variant="outlined" className={classNames(classes.activeAgentSelect, "uni_m_b_small")}>
        <InputLabel id="active-agents-label">Active Agent</InputLabel>
        <Select
          labelId="active-agents-label"
          id="active-agents"
          value={activeAgent}
          onChange={handleChangeActiveAgent}
          label="Active Agent"
        >
          <MenuItem value={localStorage.getItem("username")}>{localStorage.getItem("username")}</MenuItem>
          {agents.map(item => <MenuItem value={item.id}>{item.agentname}</MenuItem>)}
        </Select>
      </FormControl>
      {
        activeAgent !== localStorage.getItem("username") &&
        <Typography className={classes.sidebarLoc}>{"Location : " + activeAgentLoc}</Typography>
      }
      <Typography className={classes.sidebarOutTemp}>Outside Temperature
        : {weather.current?.temperature}°C </Typography>
      <Typography className={classes.sidebarTemp}>Inside Temperature : {temp}°C <IconButton><EditIcon
        onClick={() => setOpenTemperatureDialog(temp => !temp)}/></IconButton></Typography>
      <Clock speed={speed} onSpeedChange={(s)=>setSpeed(s)}/>
      <ValueController value={speed} onValueChangeCommitted = {(e, v)=> setSpeed(v)} />
      <ChangeTemperatureDialog temp={temp} setTemp={setTemp} open={openTemperatureDialog}
                               handleClose={() => setOpenTemperatureDialog(false)}/>
    </div>
  );
};

export default Sidebar;