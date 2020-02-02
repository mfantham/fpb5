import React, { useEffect, useMemo } from "react";
import { useControl } from "../react-three-gui-fork";

export const useQuality = () => {
  const lsXYQuality = useMemo(() => {
    return Number(localStorage.getItem("xyQuality"));
  });
  const lsZQuality = useMemo(() => {
    return Number(localStorage.getItem("zQuality"));
  });

  const [xyQuality] = useControl("Quality-XY", {
    type: "number",
    value: lsXYQuality || 0.1,
    min: 0.1,
    max: 1.1,
    index: 6
  });
  const [zQuality] = useControl("Quality-Z", {
    type: "number",
    value: lsZQuality || 0.1,
    min: 0.1,
    max: 1.5,
    index: 7
  });

  useEffect(() => {
    localStorage.setItem("xyQuality", xyQuality);
    localStorage.setItem("zQuality", zQuality);
  }, [xyQuality, zQuality]);

  return [xyQuality, zQuality];
};
