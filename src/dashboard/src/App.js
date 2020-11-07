import React from 'react';
import './i18n'
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import AuthPage from "./Pages/AuthPage/AuthPage";
import Layout from "./Components/Layout/Layout";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ManageHouse from "./Pages/ManageHouse/ManageHouse";
import ManageAgents from "./Pages/ManageUsers/ManageAgents";
import {LogProvider} from "./context/LogContext";
import {DashboardProvider} from "./context/DashboardContext";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={AuthPage}/>
          <PrivateRoute path={"/"} render={() =>
            <LogProvider>
              <Layout>
                <Switch>
                  <Route path={"/manage-agents"} component={ManageAgents}/>
                  <Route path={"/manage-house"} component={ManageHouse}/>
                  <DashboardProvider>
                    <Route exact path={"/"} component={DashboardPage}/>
                  </DashboardProvider>
                  <Route>
                    <Redirect to={"/"}/>
                  </Route>
                </Switch>
              </Layout>
            </LogProvider>
          }/>
        </Switch>
      </BrowserRouter>
      <ToastContainer position={"top-left"}/>
    </>
  );
};


const isLogin = () => !!localStorage.getItem("x-auth-token");

const PublicRoute = ({component, ...props}) => {
  return <Route {...props} render={(props) => {
    if (isLogin())
      return <Redirect to={"/"}/>
    else {
      return React.createElement(component, props);
    }
  }}/>
};

const PrivateRoute = ({render, ...props}) => {
  return <Route {...props} render={(props) => {
    if (isLogin())
      return render(props);
    else return <Redirect to={"/login"}/>
  }}/>
}


export default App;