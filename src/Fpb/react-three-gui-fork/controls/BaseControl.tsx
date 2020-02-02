import React from "react";
import styled from "styled-components";

type SCProps = {
  stack?: boolean;
  flexLabel?: boolean;
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  transition: all 2s ease;
`;

const Label = styled.label<SCProps>`
  display: flex;
  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  width: 69px;
  user-select: none;
  ${props => (props.flexLabel === true ? "flex: 1;" : "")}
`;

const Content = styled.div<SCProps>`
  display: flex;
  ${props => (props.flexLabel !== true ? "flex: 1;" : "")}
  justify-content: flex-end;
  padding: 0 8px;
`;

const Value = styled.div<SCProps>`
  display: flex;
  font-family: sans-serif;
  white-space: nowrap;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  justify-content: flex-end;
  user-select: none;
  ${props => (props.stack ? "flex: 1;" : "")}
  ${props => (props.stack ? "" : "width: 42px;")}
`;

type BaseControlProps = {
  label?: string;
  flexLabel?: boolean;
  value?: string;
  children?: any;
  stack?: boolean;
  htmlFor?: any;
  style?: object;
};

export function BaseControl({
  htmlFor,
  label,
  flexLabel,
  value,
  stack,
  children,
  style
}: BaseControlProps) {
  if (stack) {
    return (
      <div style={style}>
        <Row>
          <Label flexLabel={flexLabel}>{label}</Label>
          <Value stack flexLabel={flexLabel}>
            {value}
          </Value>
        </Row>
        {children}
      </div>
    );
  }

  return (
    <Row style={style}>
      <Label flexLabel={flexLabel} htmlFor={htmlFor}>
        {label}
      </Label>
      <Content flexLabel={flexLabel}>{children}</Content>
      {typeof value !== "undefined" && <Value>{value}</Value>}
    </Row>
  );
}
