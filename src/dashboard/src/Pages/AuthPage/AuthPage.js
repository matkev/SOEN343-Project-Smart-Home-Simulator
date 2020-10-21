import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import useStyles from './styles'
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {loginApi} from "../../Api/api_auth";
import {useTranslation} from "react-i18next";
import {getHouseList} from "../../Api/api_houses";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import classNames from 'classnames';


const AuthPage = () => {
  const classes = useStyles();
  const {t} = useTranslation();

  //login state
  const [usernameLogin, setUsernameLogin] = useState();
  const [passwordLogin, setPasswordLogin] = useState();
  // list  houses
  const [houses, setHouses] = useState([]);
  // display selected house
  const [house, setHouse] = React.useState();

  const handleChange = (event) => {
    setHouse(event.target.value);
  };
  useEffect(() => {
    getHouseList().then(payload => {
      setHouses(payload);
    }).catch(err => {
      toast.error(err.message);
    })
  }, []);


  const validateLogin = (user) => {
    if (!user.username)
      return t("validate.userName");
    if (!user.password)
      return t("validate.password")
    if (!user.houseId)
      return "please select house layout";
  };

  const handleLogin = (e) => {
    e.preventDefault()
    const user = {
      username: usernameLogin,
      password: passwordLogin,
      houseId: house
    };
    console.log(user);
    const error = validateLogin(user);
    if (error)
      return toast.warn(error);
    loginApi(user, (isOk, data) => {
      if (!isOk)
        return toast.error(data);
      toast.success(t("success.login"));
      localStorage.setItem("name", data.name);
      localStorage.setItem("image", data.image);
      localStorage.setItem("username", data.username);
      localStorage.setItem("x-auth-token", data["x-auth-token"]);
      localStorage.setItem("houseId", house);
      window.location.reload();
    })
  };

  return (
    <Paper className={classes.container}>

      <Typography className={classes.headerText}>{"Welcome To Smart Home Simulator"}</Typography>
      <img src={"/assets/images/UserLogin.jpg"} className={classes.ulog}/>
      <form className={classes.containerInput}>
        <Typography>{"User ID:"}</Typography>
        <Input className={"uni_m_b_small"}
               value={usernameLogin} onChange={e => setUsernameLogin(e.target.value)}
        >
        </Input>
        <Typography>{"Password :"}</Typography>
        <Input className={"uni_m_b_small"} type={'password'}
               value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)}
        />
        <FormControl variant="outlined" className={classNames(classes.formControl,"uni_m_b_small")}>
          <InputLabel id="demo-simple-select-outlined-label">House</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={house}
            onChange={handleChange}
            label="House"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {houses.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant={"contained"} type={"submit"} color="primary" onClick={handleLogin}>{t("btn.login")}</Button>
      </form>
      <img src={'/assets/images/loginpage.PNG'} className={classes.cover}/>
    </Paper>
  );
};

export default AuthPage;