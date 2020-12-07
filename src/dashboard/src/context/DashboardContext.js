import React from "react";

var DashboardStateContext = React.createContext();
var DashboardDispatchContext = React.createContext();

function dashboardReducer(state, action) {
  //type of action/property, if they match in name.
  const setActions = ["weather", "activeagent", "activeagentdetail", "activeagentloc", "rooms", "daycycle", "temperature", "season"]; 
  const setActionIndex = setActions.indexOf(action.type.slice(3).toLowerCase());
  //if action.type is among list of setActions,
  if (~setActionIndex){
    //then return a new state with the mentioned property changed to the payload value.
    const newState = {...state};
    newState[setActions[setActionIndex]] = action.payload;
    return newState;
  }
  switch (action.type) {
    case "setWeather":
      return {...state, weather: action.payload};
    case "setActiveAgent":
      return {...state, activeAgent: action.payload};
    case "setActiveAgentDetail":
      return {...state, activeAgentDetail: action.payload};
    case "setActiveAgentLoc":
      return {...state, activeAgentLoc: action.payload};
    case "setRooms":
      return {...state, rooms: action.payload};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DashboardProvider({children}) {
  const initialState = {
    weather:{},
    activeAgent:localStorage.getItem("username"),
    activeAgentDetail:undefined,
    activeAgentLoc:"None",
    rooms : [],
  };
  var [state, dispatch] = React.useReducer(dashboardReducer, initialState);
  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  );
}


function useDashboardState() {
  var context = React.useContext(DashboardStateContext);
  if (context === undefined) {
    throw new Error("useDashboardState must be used within a DashboardProvider");
  }
  return context;
}


function useDashboardDispatch() {
  var context = React.useContext(DashboardDispatchContext);
  if (context === undefined) {
    throw new Error("useDashboardDispatch must be used within a DashboardProvider");
  }
  return context;
}

export {
  DashboardProvider,
  useDashboardState,
  useDashboardDispatch,
  setWeather,
  setActiveAgent,
  setActiveAgentDetail,
  setActiveAgentLoc,
  setRooms,
  setDayCycle,
  setTemperature,
  setSeason
};

// ###########################################################
function setWeather(dispatch , data) {
  dispatch({
    type: "setWeather",
    payload : data,
  });
}
function setActiveAgent(dispatch , data) {
  dispatch({
    type: "setActiveAgent",
    payload : data,
  });
}
function setActiveAgentDetail(dispatch , data) {
  dispatch({
    type: "setActiveAgentDetail",
    payload : data,
  });
}
function setActiveAgentLoc(dispatch , data) {
  dispatch({
    type: "setActiveAgentLoc",
    payload : data,
  });
}
function setRooms(dispatch , data) {
  dispatch({
    type: "setRooms",
    payload : data,
  });
}
function setDayCycle(dispatch , data) {
  dispatch({
    type: "setDayCycle",
    payload : data,
  });
}
function setTemperature(dispatch , data) {
  dispatch({
    type: "setTemperature",
    payload : data,
  });
}
function setSeason(dispatch , data) {
  dispatch({
    type: "setSeason",
    payload : data,
  });
}