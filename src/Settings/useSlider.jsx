import React, {useEffect, useState} from 'react';
import {useStore, api} from '../Fpb/FpbContext';

const setsetset = (value) => {
  api.setState({quality: 0.3});
}

export const useSlider = (min, max, step, defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = e => {
    setValue(e.target.value);
    setsetset(0.1);
  }

  useEffect(() => {
    console.log(value);
  }, [value]);

  const props = {
    type: 'range',
    min,
    max,
    step: step,
    value: value,
    onChange: handleChange
  }
  return props;
}
