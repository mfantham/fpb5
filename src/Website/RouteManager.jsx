import React from "react";
import { useQuery } from "./useQuery";
import Navigation from "./Navigation";
import Homepage from "./Homepage";
import FPBioimage from "../Fpb/FPBioimage";

const FPBioimagePage = ({ datasetName }) => {
  const datasetUrl = `/demo/${datasetName}.json`;

  return (
    <div style={{ position: "absolute", height: "100%", width: "100%" }}>
      <FPBioimage datasetUrl={datasetUrl} />
    </div>
  );
};

export default () => {
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
