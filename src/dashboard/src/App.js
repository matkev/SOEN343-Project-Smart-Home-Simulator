import React from 'react';
import './i18n'
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {LogProvider} from "./context/LogContext";
import {DashboardProvider} from "./context/DashboardContext";
import {SHPProvider} from "./context/SHPContext";
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import ManageSimContexts from "./Pages/ManageSimContext/ManageSimContexts";
import ManageHouseLayout from "./Pages/ManageHouseLayout/ManageHouseLayout";
import ManageHouses from "./Pages/ManageHouses/ManageHouses";
import ManageAgents from "./Pages/ManageAgents/ManageAgents";
import ManageZones from "./Pages/ManageZones/ManageZones";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={ManageUsers}/>
          <PrivateRoute path={"/"} render={() =>
            <LogProvider>
              <Layout>
                <Switch>
                  <Route path={"/manage-agents"} component={ManageAgents}/>
                  <Route path={"/manage-zones"} component={ManageZones}/>
                  {/*<Route path={"/manage-house"} component={ManageHouse}/>*/}
                  <Route path={"/manage-houses"} component={ManageHouses}/>
                  <Route path={"/manage-simContext"} component={ManageSimContexts}/>
                  <Route path={"/manage-house-layout"} component={ManageHouseLayout}/>
                  <DashboardProvider>
                    <SHPProvider>
                      <Route exact path={"/"} component={DashboardPage}/>
                    </SHPProvider>
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


const isLogin = () => !!localStorage.getItem("userId");

const PublicRoute = ({component, ...props}) => {
  return <Route {...props} render={(props) => {
    if (isLogin())
      return <Redirect to={"/manage-houses"}/>
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