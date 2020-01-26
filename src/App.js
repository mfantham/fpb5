import React from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import RouteManager from "./Website/RouteManager";

const App = styled.div`
  background-color: #222;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: calc(10px + 2vmin);
`;

export default () => {
  return (
    <BrowserRouter>
      <App>
        <RouteManager />
      </App>
    </BrowserRouter>
  );
};
