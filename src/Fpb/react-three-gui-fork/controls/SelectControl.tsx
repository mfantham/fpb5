import React from 'react';
import styled from 'styled-components';
import { BaseControl } from './BaseControl';

const Select = styled.select`
  display: block;

  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);

  display: block;
  position: relative;

  width: 100%;
  height: 32px;

  margin-left: 8px;

  border: 0;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 0 4px;
`;

const Option = styled.option`
  background-color: black;
`;

export function SelectControl({ control, value }: any) {
  return (
    <BaseControl label={control.name}>
      <Select value={value} onChange={e => control.set(e.currentTarget.value)}>
        {control.config.items.map((item: string, i: number) => (
          <Option key={i}>{item}</Option>
        ))}
      </Select>
    </BaseControl>
  );
}
