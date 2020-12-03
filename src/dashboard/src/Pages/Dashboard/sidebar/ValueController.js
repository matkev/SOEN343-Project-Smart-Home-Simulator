import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

//Value controller with slider + input.
const ValueController = (props) => {
    const classes = useStyle();
    const [value, setValue] = useState(props.value);
  
    useEffect(() => {
        setValue(props.value);
    }, [props.value]); //runs when props.value updates.

    useEffect(() => {
        let a = props.onValueChange?.(value);
    }, [value]); //runs when value updates.

    const marks = [
        {
          value: 1,
        }
      ];

    //onChange of slider
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };
  
    //onChange of input
    const handleInputChange = (event) => {
        const targetValue = event.target.value === '' ? '' : Number(event.target.value);
        setValue(targetValue);
        let a = props.onValueChangeCommitted?.(event,targetValue);
    };

    //limit input
    const handleBlur = () => {
      if (value < minValue) {
        setValue(minValue);
      } else if (value > maxValue) {
        setValue(maxValue);
      }
    };
  
    //render
    const minValue  = props?.min    ?? 2    ;
    const maxValue  = props?.max    ?? 5   ;
    const hasSlider = props?.slider ?? true ;
    const hasInput  = props?.input  ?? true ;
    return (
      <div className={classes.root}>
            {hasSlider ? 
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              onChangeCommitted={(e,v)=>props.onValueChangeCommitted?.(e,v)}
              aria-labelledby="input-slider"
              step={0.1}
              marks = {marks}
              min={minValue}
              max={maxValue}
              valueLabelDisplay="auto"
            /> : ""}
            {hasInput ? 
            <Input
              className={classes.input}
              value={value}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 1,
                min: minValue,
                max: maxValue,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            /> : ""}
      </div>
    );
}
export default ValueController;