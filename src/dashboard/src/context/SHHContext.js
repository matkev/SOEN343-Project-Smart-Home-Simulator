import React from "react";
import HAVCSystem from "../Pages/Dashboard/module/HAVCSystem";

var SHHStateContext = React.createContext();
var SHHDispatchContext = React.createContext();

function shhReducer(state, action) {
  //type of action/property, if they match in name.
  const setActions = ["summertemperature", "wintertemperature", "zones"]; 
  const setActionIndex = setActions.indexOf(action.type.slice(3).toLowerCase());
  //if action.type is among list of setActions,
  if (~setActionIndex){
    //then return a new state with the mentioned property changed to the payload value.
    const newState = {...state};
    newState[setActions[setActionIndex]] = action.payload;
    return newState;
  }
  switch (action.type) {
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SHHProvider(props) {
  const children = props.children;
  const initialState = {
    summertemperature: props?.summertemperature?? 10,
    wintertemperature: props?.wintertemperature?? 15,
    zones: []
  };
  var [state, dispatch] = React.useReducer(shhReducer, initialState);
  return (
    <SHHStateContext.Provider value={state}>
      <SHHDispatchContext.Provider value={dispatch}>
        <HAVCSystem>
          {children}
        </HAVCSystem>
      </SHHDispatchContext.Provider>
    </SHHStateContext.Provider>
  );
}


function useSHHState() {
  var context = React.useContext(SHHStateContext);
  if (context === undefined) {
    throw new Error("useSHHState must be used within a SHHProvider");
  }
  return context;
}


function useSHHDispatch() {
  var context = React.useContext(SHHDispatchContext);
  if (context === undefined) {
    throw new Error("useSHHDispatch must be used within a SHHProvider");
  }
  return context;
}

export {
  SHHProvider,
  useSHHState,
  useSHHDispatch,
  setSummerTemperature,
  setWinterTemperature,
  setZones
};

// ###########################################################
function setSummerTemperature(dispatch , data) {
  dispatch({
    type: "setSummerTemperature",
    payload : data,
  });
}
function setWinterTemperature(dispatch , data) {
  dispatch({
    type: "setWinterTemperature",
    payload : data,
  });
}
function setZones(dispatch , data){
  dispatch({
    type: "setZones",
    payload : data,
  });
}
