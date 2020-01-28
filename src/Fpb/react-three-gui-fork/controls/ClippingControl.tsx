import React from "react";
import styled from "styled-components";
import { animated, interpolate, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { clamp, map, wrap180 } from "../utils";
import { Checkbox, FakeCheckbox } from "./BooleanControl";
import { InputRange } from "./NumberControl";

const THRESHOLD = 0.00001;

const ClippingControlHolder = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LabelHolder = styled.div`
  display: flex;
  flex-direction: row;
`;

const ControlHolder = styled.div<{ open: boolean }>`
  display: flex;
  flex-direction: row;
  height: ${p => (p.open ? "155px" : "0px")};
  overflow: hidden;
  transition: all 0.4s ease;
`;

const ValueHolder = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const CheckboxHolder = styled.div`
  display: flex;
  padding: 0 8px;
`;

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

const SliderHolder = styled.div`
  width: 12px;
  margin-left: 20px;
  height: 150px;
`;

const VerticalSlider = styled(InputRange)`
  width: 150px;
  height: 12px;
  transform: rotate(-90deg) translateX(-56px) translateY(-71px);
`;

export const ClippingControl = React.memo(({ control, value }: any) => {
  const ref = React.useRef<SVGElement>();
  const stage = React.useRef(null);
  const { distance = 1, scrub = false, min = -5, max = 5 } = control.config;
  const [{ width, height }] = React.useState({ width: 150, height: 150 });
  const [cursor, setCursor] = useSpring(() => ({
    from: {
      x: value.x,
      y: value.y
    },
    onFrame({ x, y }: any) {
      if (!scrub) {
        const vx =
          clamp(map(x, 0, width / 2, 0, distance), -distance, distance) || 0;
        const vy =
          clamp(map(y, 0, height / 2, 0, distance), -distance, distance) || 0;
        control.set(() => ({
          x: vx < THRESHOLD && vx > -THRESHOLD ? 0 : vx,
          y: vy < THRESHOLD && vy > -THRESHOLD ? 0 : vy,
          z: value.z,
          enabled: value.enabled
        }));
      }
    }
  }));

  const bind = useDrag(({ down, movement }) => {
    if (down && !stage.current) {
      stage.current = value;
    } else if (!down) {
      stage.current = null;
    }
    setCursor({ x: down ? movement[0] : 0, y: down ? movement[1] : 0 });
    if (scrub && down) {
      control.set(() => ({
        x:
          (stage as any).current.x +
          map(movement[0], 0, width / 2, 0, distance),
        y:
          (stage as any).current.y +
          map(movement[1], 0, height / 2, 0, distance),
        z: value.z,
        enabled: value.enabled
      }));
    }
  });

  const handleZ = (v: number) => {
    control.set(() => ({
      x: value.x,
      y: value.y,
      z: v,
      enabled: value.enabled
    }));
  };

  const handleToggle = (v: boolean) => {
    control.set(() => ({
      x: value.x,
      y: value.y,
      z: value.z,
      enabled: v
    }));
  };

  const x = cursor.x.interpolate((n: number) => clamp(n + width / 2, 0, width));
  const y = cursor.y.interpolate((n: number) =>
    clamp(n + height / 2, 0, height)
  );

  const checkboxId = `Control${control.id.current}`;

  return (
    <ClippingControlHolder>
      <LabelHolder>
        <Label htmlFor={checkboxId}>{control.name}</Label>
        <CheckboxHolder>
          <Checkbox
            id={checkboxId}
            type="checkbox"
            checked={value.enabled}
            onChange={e => handleToggle(e.currentTarget.checked)}
          />
          <FakeCheckbox htmlFor={checkboxId} />
        </CheckboxHolder>
      </LabelHolder>
      <ControlHolder open={value.enabled}>
        <animated.svg
          ref={ref as any}
          style={{
            userSelect: "none",
            touchAction: "none",
            borderRadius: 8,
            border: "1px solid #f0f0f0"
          }}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          {...bind()}
        >
          <rect fill="rgba(250, 250, 250, 0.2)" width="100%" height="100%" />
          <animated.line x1={x} x2={x} y1={0} y2="100%" stroke="#ccc" />
          <animated.line x1={0} x2="100%" y1={y} y2={y} stroke="#ccc" />
          <animated.g
            style={{
              transform: interpolate(
                [x, y],
                (x, y) => `translate(${x}px, ${y}px)`
              )
            }}
          >
            <circle r={8} fill="#ccc" />
            <circle r={4} fill="#aaa" />
          </animated.g>
        </animated.svg>
        <SliderHolder>
          <VerticalSlider
            type="range"
            step={0.01}
            onChange={e => handleZ(parseFloat(e.target.value))}
            value={value.z}
            min={min.z}
            max={max.z}
          />
        </SliderHolder>
        <ValueHolder style={{ marginLeft: "auto" }}>
          <Value>Rx:</Value>
          <Value>Ry:</Value>
          <Value>z:</Value>
        </ValueHolder>
        <ValueHolder style={{ width: "35px" }}>
          <Value>{wrap180(value.x)}°</Value>
          <Value>{wrap180(value.y)}°</Value>
          <Value>{value.z.toFixed(2)}</Value>
        </ValueHolder>
      </ControlHolder>
    </ClippingControlHolder>
  );
});
