import { useControl } from "../react-three-gui-fork";
import { PROJECTIONS } from "../constants";

export const useRendering = metadata => {
  const [projectionValue, projectionSet, projectionSetVisible] = useControl(
    "Projection",
    {
      type: "select",
      items: PROJECTIONS,
      value: PROJECTIONS[metadata.projection],
      index: 0
    }
  );
  const [opacityValue, opacitySet, opacitySetVisible] = useControl("Opacity", {
    type: "number",
    value: metadata.opacity / 8,
    min: 0,
    max: 1,
    up: "Period",
    down: "Comma",
    index: 1,
    visible: true // setting this isn't working quite yet! Low priority :shrug:
  });
  const [intensityValue, intensitySet, intensitySetVisible] = useControl(
    "Intensity",
    {
      type: "number",
      value: metadata.intensity,
      min: 0,
      max: 5.0,
      up: "KeyM",
      down: "KeyN",
      index: 2
    }
  );
  const [thresholdValue, thresholdSet, thresholdSetVisible] = useControl(
    "Cutoff",
    {
      type: "number",
      value: metadata.threshold,
      min: 0,
      max: 1.0,
      up: "KeyB",
      down: "KeyV",
      index: 3
    }
  );
  const [sizeValue, sizeSet, sizeSetVisible] = useControl("Size", {
    type: "number",
    value: 3.5,
    min: 0.1,
    max: 5,
    up: "Equal",
    down: "Minus",
    index: 3,
    visible: false // Seems a redundant control when users can zoom
  });

  const setRendering = rendering => {
    const { projection, opacity, intensity, threshold, size } = rendering;
    projection >= 0 && projectionSet(PROJECTIONS[projection]);
    opacity >= 0 && opacitySet(opacity);
    intensity >= 0 && intensitySet(intensity);
    threshold >= 0 && thresholdSet(threshold);
    size >= 0 && sizeSet(size);
  };

  return [
    {
      projection: {
        value: projectionValue,
        set: projectionSet,
        setVisible: projectionSetVisible
      },
      opacity: {
        value: opacityValue,
        set: opacitySet,
        setVisible: opacitySetVisible
      },
      intensity: {
        value: intensityValue,
        set: intensitySet,
        setVisible: intensitySetVisible
      },
      threshold: {
        value: thresholdValue,
        set: thresholdSet,
        setVisible: thresholdSetVisible
      },
      size: { value: sizeValue, set: sizeSet, setVisible: sizeSetVisible }
    },
    setRendering
  ];
};
