import { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring/three";
import { controls, controlsEmitter } from "../index";
import { ControlConfig, ControlItem } from "../types";
import { clamp, defaultConfig, defaultValue } from "../utils";

let uid = 0;

export const useControl = (
  name: string,
  config: ControlConfig = defaultConfig
) => {
  const id = useRef(uid++);
  const listener = useRef<Function>();
  let [value, set] = useState(defaultValue(config));
  const initialVisible = config.visible !== undefined ? config.visible : true;
  const [visible, setVisible] = useState(initialVisible);

  const [spring, setSpring] = useSpring(() => ({
    value,
    config: typeof config.spring === "object" ? config.spring : undefined
  }));

  if (config.state) {
    value = config.state[0];
    set = config.state[1];
  }

  useEffect(() => {
    console.log(
      `Feature coming soon: setting visibility of ${name} to ${visible}`
    );
  }, [visible]);

  const externalSet = (v: any) => {
    if (
      config.type === "number" &&
      config.min !== undefined &&
      config.max !== undefined
    ) {
      v = clamp(v, config.min, config.max);
    }
    controls.get(id)!.set(v);
    set(v);
  };

  useEffect(() => {
    const control: ControlItem = {
      id,
      name,
      set,
      value,
      visible,
      config,
      addEventListener(fn: Function) {
        listener.current = fn;
      }
    };
    controls.set(id, control);
    controlsEmitter.update();
    return () => {
      controls.delete(id);
      controlsEmitter.update();
    };
  }, []);

  useEffect(() => {
    config.spring && void setSpring({ value });
    listener.current && void listener.current(value);
    config.onChange && void config.onChange(value);
  }, [value]);

  if (config.spring) {
    return spring.value;
  }

  return [value, externalSet, setVisible];
};
