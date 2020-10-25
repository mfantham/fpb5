import React from "react";
import styled from "styled-components";

export default styled.div`
  height: 1em;
  width: 1em;

  border: 0.25em solid rgba(255,255,255,0.4);
  border-top: 0.25em solid rgba(255,255,255,0.75);
  border-radius: 50%;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
