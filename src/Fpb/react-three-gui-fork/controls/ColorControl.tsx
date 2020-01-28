import React, { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { BaseControl } from './BaseControl';

const ColorPicker = styled.div`
  position: relative;
`;

const ColorBox = styled.div`
  width: 32px;
  height: 16px;
  margin-right: -8px;
  border: 2px solid white;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;

const Picker = styled.div<{ open: boolean }>`
  position: absolute;
  bottom: 0px;
  right: -8px;
  z-index: 100;
  overflow: hidden;
  width: ${p => p.open ? "225px" : "0px"};
  height: ${p => p.open ? "234.25px" : "0px"};
  opacity: ${p => p.open ? "100%" : "0%"};
  transition: all 0.4s ease;
`;

export function ColorControl({ control, value }: any) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>();
  const handleClick = (e: any) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClick);
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <BaseControl label={control.name} flexLabel>
      <ColorPicker>
        <ColorBox
          style={{ backgroundColor: value }}
          onClick={() => {
            setOpen(!open);
          }}
        />
        <Picker open={open} ref={pickerRef as any}>
          <ChromePicker
            color={value}
            onChange={color => control.set(color.hex)}
            disableAlpha
          />
        </Picker>
      </ColorPicker>
    </BaseControl>
  );
}
