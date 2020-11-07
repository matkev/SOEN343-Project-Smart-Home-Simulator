import React from "react";

var DashboardStateContext = React.createContext();
var DashboardDispatchContext = React.createContext();

function dashboardReducer(state, action) {
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
    activeAgent:"admin",
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
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}


function useDashboardDispatch() {
  var context = React.useContext(DashboardDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
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
  setRooms
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