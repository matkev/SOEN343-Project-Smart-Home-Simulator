import React from "react";

var SHCStateContext = React.createContext();
var SHCDispatchContext = React.createContext();

function shcReducer(state, action) {
  //type of action/property, if they match in name.
  const setActions = ["openwindows"]; 
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

function SHCProvider(props) {
  const children = props.children;
  const initialState = {
    awaymode: props?.awaymode?? false
  };
  var [state, dispatch] = React.useReducer(shcReducer, initialState);
  return (
    <SHCStateContext.Provider value={state}>
      <SHCDispatchContext.Provider value={dispatch}>
        {children}
      </SHCDispatchContext.Provider>
    </SHCStateContext.Provider>
  );
}


function useSHCState() {
  var context = React.useContext(SHCStateContext);
  if (context === undefined) {
    throw new Error("useSHCState must be used within a SHCProvider");
  }
  return context;
}


function useSHCDispatch() {
  var context = React.useContext(SHCDispatchContext);
  if (context === undefined) {
    throw new Error("useSHCDispatch must be used within a SHCProvider");
  }
  return context;
}

export {
  SHCProvider,
  useSHCState,
  useSHCDispatch,
  setOpenWindows
};

// ###########################################################
function setOpenWindows(dispatch , data) {
  dispatch({
    type: "setOpenWindows",
    payload : data,
  });
}
