import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ExampleLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

export default () => {
  return (
    <div>
      <h1>FPBioimage Demo Site</h1>
      <ul>
        <li>
          <ExampleLink to="/data/brain">MRI Brain</ExampleLink>
        </li>
        <li>
          <ExampleLink to="/data/mouse">Mouse embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="/data/worm">C. Elegans embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="/data/keller">Drosophilla embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="/data/mouseHead">Mouse embryo head</ExampleLink>
        </li>
      </ul>
    </div>
  );
};
