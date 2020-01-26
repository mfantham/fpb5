import React, { useEffect, useState } from "react";
import { useLoader } from "react-three-fiber";
import { useControl } from "react-three-gui";
import { TextureLoader, RepeatWrapping } from "three";
import wall from "./grid.png";

const { PI } = Math;

export default ({ boxSize = 10 }) => {
  const showBoundary = useControl("Boundary", {
    type: "boolean",
    value: true
  });

  const [color, setColor] = useState("#FFFFFF");
  useEffect(() => {
    if (showBoundary) {
      setColor("#FFFFFF");
    } else {
      setColor("#000000");
    }
  }, [showBoundary]);

  const faces = [
    { position: [0, 0, boxSize / 2], rotation: [0, PI, 0] },
    { position: [0, 0, -boxSize / 2], rotation: [0, 0, 0] },
    { position: [boxSize / 2, 0, 0], rotation: [0, -PI / 2, 0] },
    { position: [-boxSize / 2, 0, 0], rotation: [0, PI / 2, 0] },
    { position: [0, boxSize / 2, 0], rotation: [PI / 2, 0, 0] },
    { position: [0, -boxSize / 2, 0], rotation: [-PI / 2, 0, 0] }
  ];

  const texture = useLoader(TextureLoader, wall);
  texture.repeat.x = 10;
  texture.repeat.y = 10;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  const meshes = faces.map((face, i) => {
    return (
      <mesh
        key={i}
        position={face.position}
        rotation={face.rotation}
        scale={[boxSize, boxSize, boxSize]}
      >
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" color={color} map={texture} />
      </mesh>
    );
  });

  return <object3D>{meshes}</object3D>;
};
