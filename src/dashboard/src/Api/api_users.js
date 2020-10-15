const sampleUserList = [
  {
    ID : "56166",
    Name : "Mathew",
    permissions: {
      light: false,
      ac: false,
      temp: true,
      doors: true
    }
  },
  {
    ID : "45454",
    Name : "Pascal",
    permissions: {
      light: true,
      ac: false,
      temp: false,
      doors: true
    }
  },
  {
    ID : "16165",
    Name : "Mansi",
    permissions: {
      light: false,
      ac: false,
      temp: true,
      doors: false
    }
  },
  {
    ID : "46546",
    Name : "Nila",
    permissions: {
      light: true,
      ac: true,
      temp: true,
      doors: true
    }
  },
]
export const getUserList = (callback) => {
    callback(true,sampleUserList);
};
