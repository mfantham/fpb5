import React from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import RouteManager from "./Website/RouteManager";

const AppPageHolder = styled.div`
  background-color: #222;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: calc(10px + 2vmin);
`;

const App = () => {
  return (
    <BrowserRouter>
      <AppPageHolder>
        <RouteManager />
      </AppPageHolder>
    </BrowserRouter>
  );
};

export default App;
