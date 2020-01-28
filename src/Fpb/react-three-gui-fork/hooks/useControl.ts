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

  const [spring, setSpring] = useSpring(() => ({
    value,
    config: typeof config.spring === "object" ? config.spring : undefined
  }));

  if (config.state) {
    value = config.state[0];
    set = config.state[1];
  }

  const externalSet = (v: any) => {
    // should be min and max from config here.
    v = clamp(v, 0, 1); // config.min, config.max); // urgh, typescript.
    console.log(controls.get(id));
    controls.get(id)!.set(v);
    set(v);
  };

  useEffect(() => {
    const control: ControlItem = {
      id,
      name,
      set,
      value,
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

  return [value, externalSet];
};
