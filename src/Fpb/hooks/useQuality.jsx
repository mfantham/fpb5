import { useEffect, useMemo } from "react";
import { useControl } from "../react-three-gui-fork";

export const useQuality = () => {
  const lsXYQuality = useMemo(() => {
    return Number(localStorage.getItem("xyQuality") || 0.4);
  }, []);
  const lsZQuality = useMemo(() => {
    return Number(localStorage.getItem("zQuality") || 0.4);
  }, []);
  const lsZInterp = useMemo(() => {
    return localStorage.getItem("zInterp") === "true" || false;
  }, []);

  const [xyQuality] = useControl("Quality-XY", {
    type: "number",
    value: lsXYQuality || 0.4,
    min: 0.1,
    max: 1.1,
    index: 6,
  });
  const [zQuality] = useControl("Quality-Z", {
    type: "number",
    value: lsZQuality || 0.4,
    min: 0.1,
    max: 1.5,
    index: 7,
  });
  const [zInterp] = useControl("Interpolate-Z", {
    type: "boolean",
    value: !!lsZInterp,
    index: 7.5,
  });

  useEffect(() => {
    localStorage.setItem("xyQuality", xyQuality);
    localStorage.setItem("zQuality", zQuality);
    localStorage.setItem("zInterp", !!zInterp ? true : false);
  }, [xyQuality, zQuality, zInterp]);

  return [xyQuality, zQuality, zInterp];
};
