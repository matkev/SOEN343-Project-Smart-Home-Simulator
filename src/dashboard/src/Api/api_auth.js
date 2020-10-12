export const loginApi = (user, callback) => {
  if (user.username === "admin" && user.password === "123456")
    callback(true,{
      name : 'admin',
      image : "/assets/images/man.png",
      username : "admin",
      'x-auth-token' : "cvbhjmnbvcfghjkmnbcfghjkl,mnbvcghjk"
    });
  else callback(false, "No user with this username and password")
};

// http://sone343.com/api/login
// {username , password}
// {success : true , messagev : "..."}
//
