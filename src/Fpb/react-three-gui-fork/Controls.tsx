import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ControlGroup } from "./components/ControlGroup";
import { controls, controlsEmitter } from "./index";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";

const Float = styled.div<{ open: boolean }>`
  display: block;
  position: fixed;
  top: 50px;
  right: ${p => (p.open ? 0 : "-300px")};
  width: 300px;
  max-width: 100vw;
  background-color: #2228;
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.12);
  transition: right 0.4s ease;
`;

const Toggle = styled.button`
  font-size: 1.4rem;
  padding: 0 0 3px 0;
  position: fixed;
  color: white;
  top: 55px;
  right: 5px;
  width: 48px;
  height: 48px;
  border: 0;
  background: transparent;
  border-radius: 100vh;
  backdrop-filter: blur(20px);

  :hover {
    background: rgba(255, 255, 255, 0.5);
  }

  :focus {
    outline: 0;
  }

  transition: 0.2s ease;
  transition-property: background, box-shadow;
`;

const Items = styled.div`
  padding: 42px 0 0 0;
`;

const DEFAULT_GROUP = "DEFAULT_GROUP";

const groupByGroup = (items: any): any => {
  return Array.from(items).reduce((acc: any, item: any) => {
    const groupName = item[1].config.group || DEFAULT_GROUP;
    acc[groupName] = acc[groupName] || [];
    acc[groupName].push(item);
    return acc;
  }, {} as { [key: string]: any });
};

export const Controls = React.memo(() => {
  const [open, setOpen] = useState<boolean>(window.innerWidth > 600);
  const [, set] = useState<number>(0);

  useEffect(() => {
    controlsEmitter.update = () => {
      set(n => n + 1);
      return null;
    };
  }, []);

  return (
    <>
      <Float open={open}>
        <Items>
          {Object.entries(groupByGroup(controls)).map(
            ([groupName, items]: any) => (
              <ControlGroup
                key={groupName}
                title={groupName}
                controls={items}
              />
            )
          )}
        </Items>
      </Float>
      <Toggle
        title={open ? "Hide" : "Control menu"}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <FontAwesomeIcon icon={faHamburger} size="lg" />
      </Toggle>
    </>
  );
});
