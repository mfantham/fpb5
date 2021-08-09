import styled from "styled-components";
import FPBioimage from "../Fpb/FPBioimage";

const FPBioimageHolder = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const FPBioimagePage = ({ datasetName }) => {
  const datasetUrl = `/demo/${datasetName}.json`;

  return (
    <FPBioimageHolder>
      <FPBioimage datasetUrl={datasetUrl} />
    </FPBioimageHolder>
  );
};

export default FPBioimagePage;
