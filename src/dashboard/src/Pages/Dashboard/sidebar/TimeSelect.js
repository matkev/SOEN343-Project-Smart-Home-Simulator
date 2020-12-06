import React, { useState } from "react";
import { TimePicker } from "@material-ui/pickers";

//
//props.value is the value
//props.onChange is the onChange callback
const TimeSelect = (props) => {
  const [date, changeDate] = useState(props?.value ?? new Date());

  const onChangeDate = (date) =>{
      changeDate(date);
      props.onChange(date);
  };

  const doReturn = (props === undefined) || (props.value !== undefined);
  return (doReturn)
  ?
    <TimePicker
      autoOk
      ampm={false}
      variant="static"
      orientation="landscape"
      openTo="minutes"
      value={date}
      views={["hours", "minutes", "seconds"]}
      onChange={onChangeDate}
    />
   : "";
};

export default TimeSelect;