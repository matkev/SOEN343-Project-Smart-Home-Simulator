import React from "react";

var ClockStateContext = React.createContext();
var ClockDispatchContext = React.createContext();

function clockReducer(state, action) {
  //type of action/property, if they match in name.
  const setActions = ["time"]; 
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

function ClockProvider(props) {
  const children = props.children;
  const initialState = {
    time: props?.time ?? new Date().getTime()
  };
  var [state, dispatch] = React.useReducer(clockReducer, initialState);
  return (
    <ClockStateContext.Provider value={state}>
      <ClockDispatchContext.Provider value={dispatch}>
        {children}
      </ClockDispatchContext.Provider>
    </ClockStateContext.Provider>
  );
}


function useClockState() {
  var context = React.useContext(ClockStateContext);
  if (context === undefined) {
    throw new Error("useClockState must be used within a ClockProvider");
  }
  return context;
}


function useClockDispatch() {
  var context = React.useContext(ClockDispatchContext);
  if (context === undefined) {
    throw new Error("useClockDispatch must be used within a ClockProvider");
  }
  return context;
}

export {
  ClockProvider,
  useClockState,
  useClockDispatch,
  setTime
};

// ###########################################################
function setTime(dispatch , data) {
  dispatch({
    type: "setTime",
    payload : data,
  });
}
