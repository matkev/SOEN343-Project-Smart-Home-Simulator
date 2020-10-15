import React from 'react';
import './i18n'
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import AuthPage from "./Pages/AuthPage/AuthPage";
import Layout from "./Components/Layout/Layout";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ManageHouse from "./Pages/ManageHouse/ManageHouse";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={AuthPage}/>
          <PrivateRoute path={"/"} render={() =>
            <Layout>
              <Switch>
                <Route exact path={"/"} component={DashboardPage}/>
                <Route path={"/manage-users"} component={ManageUsers}/>
                <Route path={"/manage-house"} component={ManageHouse}/>
                <Route component={ManageUsers}/>
              </Switch>
            </Layout>
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