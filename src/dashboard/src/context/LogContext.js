import React from "react";

var LogStateContext = React.createContext();
var LogDispatchContext = React.createContext();

function createLog({text, user}) {
  return `${new Date().toLocaleTimeString()} ${user ? user : ""} ${text}`
}

function logReducer(state, action) {
  switch (action.type) {
    case "ADD_LOG":
      return {...state, logs: [...state.logs, createLog(action.payload)]};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LogProvider({children}) {
  const initialState = {
    logs: [
      // {
      //   time : "",
      //   user : "",
      //   text : ""
      // }
    ],
  };
  var [state, dispatch] = React.useReducer(logReducer, initialState);
  return (
    <LogStateContext.Provider value={state}>
      <LogDispatchContext.Provider value={dispatch}>
        {children}
      </LogDispatchContext.Provider>
    </LogStateContext.Provider>
  );
}


function useLogState() {
  var context = React.useContext(LogStateContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}


function useLogDispatch() {
  var context = React.useContext(LogDispatchContext);
  if (context === undefined) {
    throw new Error("useLogDispatch must be used within a LayoutProvider");
  }
  return context;
}

export {
  LogProvider,
  useLogState,
  useLogDispatch,
  addLog,
};

// ###########################################################
function addLog(dispatch, text, user) {
  dispatch({
    type: "ADD_LOG",
    payload: {text, user},
  });
}