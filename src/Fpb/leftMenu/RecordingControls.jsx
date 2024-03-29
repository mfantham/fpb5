import styled from "styled-components";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ButtonHolder } from "./Button";
import Screenshot from "./Screenshot";
import Bookmarks from "./Bookmarks";
import LiveVideo from "./LiveVideo";
import Video from "./Video";

const FloatingLeftMenu = styled.div`
  display: block;
  position: fixed;
  top: 50px;
  left: ${(p) => (p.open ? 0 : "-300px")};
  width: 300px;
  max-width: 100vw;
  background-color: #2228;
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.12);
  transition: left 0.4s ease;
`;

const Toggle = styled.button`
  font-size: 1.4rem;
  padding: 0 0 3px 0;
  position: fixed;
  color: white;
  top: 55px;
  left: 5px;
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
  padding: 58px 16px 16px 16px;
`;

const RecordingControls = ({ useBookmarks }) => {
  const [open, setOpen] = useState(window.innerWidth > 600);

  return (
    <>
      <FloatingLeftMenu style={{ height: 400 }} open={open}>
        <Items>
          <ButtonHolder>
            <Screenshot />
            <LiveVideo />
          </ButtonHolder>
          <Bookmarks useBookmarks={useBookmarks} />
          <ButtonHolder>
            <Video />
          </ButtonHolder>
        </Items>
      </FloatingLeftMenu>
      <Toggle
        title={open ? "Hide" : "Screenshots, videos, bookmarks"}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <FontAwesomeIcon icon={faCamera} size="lg" />
      </Toggle>
    </>
  );
};

export default RecordingControls;
