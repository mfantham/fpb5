import React from "react";
import styled from "styled-components";
import { animated, interpolate, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { clamp, map, wrap180 } from "../utils";
import { Select, Option } from "./SelectControl";
import { InputRange } from "./NumberControl";

const THRESHOLD = 0.00001;

const RenderingControlHolder = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LabelHolder = styled.div`
  display: flex;
  flex-direction: row;
`;

// const ControlHolder = styled.div<{ open: boolean }>`
//   display: flex;
//   flex-direction: row;
//   height: ${p => (p.open ? "155px" : "0px")};
//   overflow: hidden;
//   transition: all 0.4s ease;
// `;

const Label = styled.label`
  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  user-select: none;
  flex: 1;
`;

const Value = styled.span`
  font-family: sans-serif;
  font-size: 14px;
  text-align: right;
  color: rgba(255, 255, 255, 0.75);
  user-select: none;
`;

export const RenderingControl = React.memo(({ control, value }: any) => {
  const handleOpacity = (v: number) => {
    control.set(() => ({
      mode: value.mode,
      opacity: value.opacity,
      intensity: value.intensity,
      cutoff: v,
    }));
  };

  const handleMode = (v: string) => {
    control.set(() => ({
      mode: v,
      opacity: value.opacity,
      intensity: value.intensity,
      cutoff: value.cutoff,
    }))
  }

  return (
    <RenderingControlHolder>
      <Label>Projection</Label>
      <Select
        style={{ padding: "0 0 8px 0", marginRight: "-8px" }}
        value={value.mode}
        onChange={e => handleMode(e.currentTarget.value)}
      >
        {control.config.items.map((item: string, i: number) => (
          <Option key={i}>{item}</Option>
        ))}
      </Select>
      <Label>Opacity</Label>
      <InputRange
        type="range"
        step={0.01}
        onChange={e => handleOpacity(parseFloat(e.target.value))}
        value={value.opacity}
        min={min.opacity}
        max={max.opacity}
      />
      <Value>${value.opacity}</Value>
    </RenderingControlHolder>
  );
});
