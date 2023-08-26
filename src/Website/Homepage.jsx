import styled from "styled-components";
import { Link } from "react-router-dom";

const ExampleLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const Homepage = () => {
  return (
    <div>
      <h1>FPBioimage Demo Site</h1>
      <ul>
        <li>
          <ExampleLink to="?demo=brain">MRI brain</ExampleLink>
        </li>
        <li>
          <ExampleLink to="?demo=cthead">CT scan</ExampleLink>
        </li>
        <li>
          <ExampleLink to="?demo=mouse">Mouse embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="?demo=worm">C. Elegans embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="?demo=keller">Drosophilla embryo</ExampleLink>
        </li>
        <li>
          <ExampleLink to="?demo=mouseHead">Mouse embryo head</ExampleLink>
        </li>
      </ul>
    </div>
  );
};

export default Homepage;
