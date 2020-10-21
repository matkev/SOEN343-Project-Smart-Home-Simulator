import React from 'react';
import './i18n'
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import AuthPage from "./Pages/AuthPage/AuthPage";
import Layout from "./Components/Layout/Layout";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import ManageHouses from "./Pages/ManageHouses/ManageHouses";
import ManageHouseLayout from "./Pages/ManageHouseLayout/ManageHouseLayout";
import ManageAgents from "./Pages/ManageAgents/ManageAgents";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={ManageUsers}/>
          <PrivateRoute path={"/"} render={() =>
            <Layout>
              <Switch>
                <Route exact path={"/"} component={DashboardPage}/>
                <Route path={"/manage-houses"} component={ManageHouses}/>
                <Route path={"/manage-agents"} component={ManageAgents}/>
                <Route path={"/manage-house-layout"} component={ManageHouseLayout}/>
                <Route component={DashboardPage}/>
              </Switch>
            </Layout>
          }/>
        </Switch>
      </BrowserRouter>
      <ToastContainer position={"top-left"}/>
    </>
  );
};


// const isLogin = () => !!localStorage.getItem("userId");

const PublicRoute = ({component, ...props}) => {
  return <Route {...props} render={(props) => {
    // if (isLogin())
    //   return <Redirect to={"/"}/>
    // else {
    //   return React.createElement(component, props);
    // }
    return React.createElement(component, props);
  }}/>
};

const PrivateRoute = ({render, ...props}) => {
  return <Route {...props} render={(props) => {
    // if (isLogin())
    //   return render(props);
    // else return <Redirect to={"/login"}/>
    return render(props);
  }}/>
}


export default App;