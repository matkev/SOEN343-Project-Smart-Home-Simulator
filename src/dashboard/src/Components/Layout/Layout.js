import React from 'react';
import useStyle from './styles';
import Header from "../Header/Header";


const Layout = ({children}) => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Header/>
      <div className={classes.fakeToolbar}></div>
      <div className={classes.content}>
      {children}
      </div>
    </div>
  );
};

export default Layout;