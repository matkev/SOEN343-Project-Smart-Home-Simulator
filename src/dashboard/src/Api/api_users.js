const sampleUserList = [
  {
    ID : "56166",
    Name : "John",
  },
  {
    ID : "45454",
    Name : "Jack",
  },
  {
    ID : "16165",
    Name : "Mansi",
  },
  {
    ID : "46546",
    Name : "hoda",
  },
]
export const getUserList = (callback) => {
    callback(true,sampleUserList);
};
