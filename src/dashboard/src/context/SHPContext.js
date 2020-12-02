import React from "react";

var SHPStateContext = React.createContext();
var SHPDispatchContext = React.createContext();

function shpReducer(state, action) {
  //type of action/property, if they match in name.
  const setActions = ["awaymode"]; 
  const setActionIndex = setActions.indexOf(action.type.slice(3).toLowerCase());
  //if action.type is among list of setActions,
  if (~setActionIndex){
    //then return a new state with the mentioned property changed to the payload value.
    const newState = {...state};
    newState[setActions[setActionIndex]] = action.payload;
    console.log(newState);
    return newState;
  }
  switch (action.type) {
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SHPProvider(props) {
  const children = props.children;
  const initialState = {
    awaymode: props?.awaymode?? false
  };
  console.log("initialState");
  console.log(initialState);
  var [state, dispatch] = React.useReducer(shpReducer, initialState);
  return (
    <SHPStateContext.Provider value={state}>
      <SHPDispatchContext.Provider value={dispatch}>
        {children}
      </SHPDispatchContext.Provider>
    </SHPStateContext.Provider>
  );
}


function useSHPState() {
  var context = React.useContext(SHPStateContext);
  if (context === undefined) {
    throw new Error("useSHPState must be used within a SHPProvider");
  }
  return context;
}


function useSHPDispatch() {
  var context = React.useContext(SHPDispatchContext);
  if (context === undefined) {
    throw new Error("useSHPDispatch must be used within a SHPProvider");
  }
  return context;
}

export {
  SHPProvider,
  useSHPState,
  useSHPDispatch,
  setAwayMode
};

// ###########################################################
function setAwayMode(dispatch , data) {
  dispatch({
    type: "setAwayMode",
    payload : data,
  });
}
