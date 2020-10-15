import React from 'react';

const Spacer = ({v,h, size}) => {
  const getSize = () => {
    switch (size) {
      case "tiny":
        return "0.5rem";
      case "small":
        return "1rem";
      case "medium":
        return "2rem";
      case "big":
        return "3rem";
        default:
        return "1rem"
    }
  }
  const style = {};
  if (h)
    style.marginLeft = getSize();
  if (v)
    style.marginBottom = getSize();
  return (
    <div style={style}/>
  );
};

export default Spacer;