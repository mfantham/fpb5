import React, { useState } from 'react';
import styled from 'styled-components';
import { ControlItem } from './ControlItem';

const Heading = styled.h2<{ open: boolean }>`
  display: block;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  padding-left: 16px;
  cursor: pointer;
  position: relative;
  user-select: none;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 8px;
    right: 16px;
    width: 12px;
    height: 2px;
    background-color: #333;
    /* transition: transform 0.25s ease-out; */
  }
  &:before {
    transform: rotate(${props => props.open ? 0 : 90}deg);
  }

  &:after{
    transform: rotate(${props => props.open ? 0 : 180}deg);
  }
`;

const Container = styled.div<{ open: boolean }>`
  padding: 16px;
  display: ${props => props.open ? 'block' : 'none'};
  max-height: calc(100vh - 190px);
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ControlGroup = ({ title, controls }: any) => {
  const [open, setOpen] = useState(true);
  const isDefault = title !== 'DEFAULT_GROUP';
  return (
    <div>
      {isDefault && <Heading open={open} onClick={() => setOpen(o => !o)}>{title}</Heading>}
      <Container open={open} >
        {Array.from(controls).map(([id, control]: any) => (
          <ControlItem key={id.current} control={control} />
        ))}
      </Container>
    </div>
  )
}
