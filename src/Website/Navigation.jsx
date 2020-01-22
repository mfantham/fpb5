import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const Header = styled.nav`
  position: fixed;
  font-size: 16px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-items: space-evenly;
  align-items: center;
  z-index: 10;
  background: #111;
  box-shadow: 0px 1px 5px 0px #0007;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 12px;
  flex-grow: 1;
  text-align: center;

  :hover{
    background-color: #333;
  }

  transition: 0.3s;
`;

const HomeLink = styled(NavLink)`
  font-weight: bold;
`;

const ExamplesHolder = styled(NavLink)`
  position: relative;
  :hover div{
    visibility: visible;
    opacity: 100;
  }
`;

const ExamplesList = styled.div`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  background-color: #333;
  box-shadow: 3px 3px 10px 0px #0007;
  min-width: 300px;
`;



const Example = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 12px;
  text-align: left;

  :hover{
    background-color: #666;
  }
`;

export default () => {
  return (
    <Header>
      <HomeLink to="">FPBioimage</HomeLink>
      <ExamplesHolder as="span" to="#">Examples
        <ExamplesList>
          <Example to='/data/brain'>MRI Brain</Example>
          <Example to='/data/mouse'>Mouse embryo</Example>
          <Example to='/data/worm'>C. Elegans embryo</Example>
          <Example to='/data/keller'>Drosophilla embryo</Example>
          <Example to='/data/mouseHead'>Mouse embryo head</Example>
        </ExamplesList>
      </ExamplesHolder>
      <NavLink to="/videos">Videos</NavLink>
      <NavLink to="/project">Project page</NavLink>
    </Header>
  );
}
