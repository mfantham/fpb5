import React from "react";
import { useQuery } from "./useQuery";
import Navigation from "./Navigation";
import Homepage from "./Homepage";
import FPBioimagePage from "./FPBioimagePage";

const RouteManager = () => {
  const queryParams = useQuery();
  const datasetName = queryParams.get("demo");

  return (
    <>
      <Navigation />
      {!!datasetName ? (
        <FPBioimagePage datasetName={datasetName} />
      ) : (
        <Homepage />
      )}
    </>
  );
};

export default RouteManager;
