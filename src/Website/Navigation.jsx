import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 12px;
  flex-grow: 1;
  text-align: center;

  :hover {
    background-color: #333;
  }

  transition: 0.3s;
`;

const HomeLink = styled(NavLink)`
  font-weight: bold;
`;

const ExamplesHolder = styled(NavLink)`
  position: relative;
  cursor: default;

  ${p =>
    !p.touchable
      ? `:hover div {
    visibility: visible;
    opacity: 100;}`
      : p.touched
      ? ` div {visibility: visible;
    opacity: 100;}`
      : ``}
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

  :hover {
    background-color: #666;
  }
`;

export default () => {
  const [touchable, setTouchable] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <Header>
      <HomeLink as={Link} to="">
        FPBioimage
      </HomeLink>
      <ExamplesHolder
        as="span"
        to="#"
        touchable={touchable}
        touched={touched}
        onTouchStart={() => {
          setTouched(!touched);
          setTouchable(true);
        }}
        onMouseEnter={() => {
          setTouchable(false);
        }}
      >
        Examples
        <ExamplesList>
          <Example to="?demo=brain">MRI Brain</Example>
          <Example to="?demo=mouse">Mouse embryo</Example>
          <Example to="?demo=worm">C. Elegans embryo</Example>
          <Example to="?demo=keller">Drosophilla embryo</Example>
          <Example to="?demo=mouseHead">Mouse embryo head</Example>
        </ExamplesList>
      </ExamplesHolder>
      <NavLink
        target="_blank"
        href="https://fpb.ceb.cam.ac.uk/demo/videos.html"
      >
        Videos
      </NavLink>
      <NavLink target="_blank" href="https://fpb.ceb.cam.ac.uk">
        Project page
      </NavLink>
    </Header>
  );
};
