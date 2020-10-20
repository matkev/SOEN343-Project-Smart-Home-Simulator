import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom'
import classNames from "classnames";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {getAgentList} from "../../../Api/api_agents";
import {toast} from "react-toastify";
import {getRoomList} from "../../../Api/api_room";

const Sidebar = props => {
  const classes = useStyle();
  const history = useHistory();

  const [time, setTime] = useState();
  const [agents, setAgents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const handleChangeActiveAgent = (e) => {
    if (e.target.value === "admin") {
      props.setActiveAgent("admin");
      localStorage.removeItem("activeAgent");
    } else {
      props.setActiveAgent(e.target.value);
      localStorage.setItem("activeAgent", e.target.value);
      const roomId = agents.find(item => item.id === e.target.value)?.room_id;
      const roomName = rooms.find(item => item.id === roomId)?.name;
      props.setActiveLoc(roomName);
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
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
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
        true &&
        <>
          <Button className={classes.MuserBtn} color={"secondary"} variant={"contained"} onClick={() => {
            history.push("/manage-agents")
          }}>Manage Agents</Button>
          <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
            history.push("/manage-house")
          }}>Manage Houselayout</Button>
        </>
      }
      <FormControl variant="outlined" className={classNames(classes.formControl, "uni_m_b_small")}>
        <InputLabel id="active-agents-label">Active Agent</InputLabel>
        <Select
          labelId="active-agents-label"
          id="active-agents"
          value={props.activeAgent}
          onChange={handleChangeActiveAgent}
          label="Active Agent"
        >
          <MenuItem value={"admin"}>{"admin"}</MenuItem>
          {agents.map(item => <MenuItem value={item.id}>{item.agentname}</MenuItem>)}
        </Select>
      </FormControl>
      {
        props.activeAgent !== "admin" &&
        <Typography className={classes.sidebarLoc}>{"Location : " + props.activeAgentLoc}</Typography>
      }
      <Typography className={classes.sidebarTemp}>Outside Temperature : {props.weather.current?.temperature}°C</Typography>
      <Typography className={classes.sidebarTime}>{new Date().toLocaleString()}</Typography>
    </div>
  );
};

export default Sidebar;