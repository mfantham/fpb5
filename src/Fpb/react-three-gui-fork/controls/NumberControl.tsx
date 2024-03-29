import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { clamp, map } from "../utils";
import { BaseControl } from "./BaseControl";

export const InputRange = styled.input`
  -webkit-appearance: none;
  background: transparent;
  display: inline-block;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  &::-webkit-slider-thumb {
    border: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.22);
    -webkit-appearance: none;
    margin-top: -4px;
  }

  &:focus::-webkit-slider-runnable-track {
    outline: none;
  }
`;

const PRECISION = 300;
const CENTER = PRECISION / 2;

export function NumberControl({ control, value }: any) {
  const ref = useRef<HTMLInputElement | null>(null);
  const stage = useRef(null);
  const { config } = control;
  const {
    min = config.scrub ? -Infinity : 0,
    max = config.scrub ? Infinity : Math.PI,
    up,
    down,
    visible = true,
  } = config;

  let distance = config.distance;
  if (!distance) {
    distance = config.scrub ? 2 : max - min;
  }
  const [val, setVal] = useState(
    config.scrub ? CENTER : map(value, min, max, 0, PRECISION)
  );

  useEffect(() => {
    if (value !== val) {
      setVal(map(value, min, max, 0, PRECISION));
    }
  }, [value, val]);

  const handleUserKeyPress = useCallback(
    (e) => {
      const { code } = e;
      if (code === up || code === down) {
        const direction = code === down ? -1 : 1;
        const amplification = e.getModifierState("Shift")
          ? 5
          : e.getModifierState("Alt")
          ? 0.2
          : 1;
        const step = 0.01 * amplification * direction * (max - min);
        const v = value + step;
        const newV = clamp(v, min, max);
        control.set(newV);
        setVal(map(newV, min, max, 0, PRECISION));
      }
    },
    [value]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  const handleChange = useCallback(() => {
    if (config.scrub) {
      setVal(CENTER);
      stage.current = null;
    }
  }, [config.scrub]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener("change", handleChange);
    }
    return () => {
      if (el) {
        el.removeEventListener("change", handleChange);
      }
    };
  }, [handleChange, ref]);

  const style = visible
    ? { maxHeight: "16px" }
    : { maxHeight: "0px", padding: "0", overflow: "hidden" };

  return (
    <BaseControl label={control.name} value={value.toFixed(2)} style={style}>
      <InputRange
        ref={ref}
        type="range"
        value={val}
        min={0}
        max={PRECISION}
        onChange={(e) => {
          const num = Number(e.currentTarget.value);
          setVal(num);
          if (stage.current === null) {
            stage.current = value;
          }
          const cvalue =
            (config.scrub ? (stage as any).current : 0) +
            map(
              num - (config.scrub ? CENTER : 0),
              0,
              PRECISION,
              config.scrub ? 0 : min,
              config.scrub ? distance * 2 : max
            );
          control.set(clamp(cvalue, min, max));
        }}
      />
    </BaseControl>
  );
}
