import React from 'react';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FPBioimage from './Fpb/FPBioimage';
import Navigation from './Website/Navigation';
import Homepage from './Website/Homepage';

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

const FPBioimagePage = () => {
  const { datasetName } = useParams();
  const datasetUrl = `/demo/${datasetName}.json`;

  return (
    <div style={{position: "absolute", height: "100%", width: "100%"}}>
      <FPBioimage datasetUrl={datasetUrl} />
    </div>
  )
}

export default () => {
  return (
    <BrowserRouter>
      <App>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/data/:datasetName">
            <FPBioimagePage />
          </Route>
        </Switch>
      </App>
    </BrowserRouter>
  );
}
