import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";

import path from "path";
import { useFetch } from "loti-request";

import { PNG } from "pngjs";

const ceil2 = v => {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
};

const FetchParameters = ({ datasetUrl, fetchCallback }) => {
  const fetchHook = useFetch({ url: datasetUrl, responseType: "json" });
  const { status, data } = fetchHook;
  if (status === "FAILED") {
    return (
      <span>
        Failed to fetch data from <pre>${datasetUrl}</pre>
      </span>
    );
  }
  if (status === "SUCCESS") {
    fetchCallback(data);
  }

  return null;
};

const FetchImage = ({ url, fetchCallback }) => {
  const fetchHook = useFetch({
    url: url,
    withProgress: true,
    responseType: "arraybuffer"
  });
  const { status, progress, data } = fetchHook;
  let image = null;
  if (status === "SUCCESS") {
    image = data;
  }

  fetchCallback({
    progress: progress.loaded / progress.total,
    status,
    image
  });
  return null;
};

const imageReducer = (state, action) => {
  let newProgresses = [...state.progresses];
  let newStatuses = [...state.statuses];
  let newImages = [...state.images];

  const { progress, status, image } = action.value;

  if (progress) {
    newProgresses[action.index] = progress;
  }
  if (status) {
    newStatuses[action.index] = status;
  }
  if (image) {
    newImages[action.index] = image;
  }
  return {
    progresses: newProgresses,
    statuses: newStatuses,
    images: newImages
  };
};

const initialReducerState = numAtlases => {
  const initialProgresses = new Array(numAtlases).fill(0);
  const initialStatuses = new Array(numAtlases).fill("NOT_SEND");
  const initialImages = new Array(numAtlases).fill(null);
  return {
    progresses: initialProgresses,
    statuses: initialStatuses,
    images: initialImages
  };
};

export default ({ datasetUrl, setMetadataCallback }) => {
  const numAtlases = 8;

  const location = useLocation();
  const [parameterData, setParameterData] = useState(null);
  const [fetches, setFetches] = useState(null);
  const [converting, setConverting] = useState(false);
  const [imagesState, dispatch] = useReducer(
    imageReducer,
    initialReducerState(numAtlases)
  );

  useEffect(() => {
    setFetches(
      <FetchParameters
        datasetUrl={datasetUrl}
        fetchCallback={pData => setParameterData(pData)}
      />
    );
  }, [datasetUrl]);

  useEffect(() => {
    if (parameterData !== null) {
      const { pathToImages, imagePrefix, numberingFormat } = parameterData;

      const { join, dirname, relative } = path;
      const imageDirectory = join(
        dirname(relative(location.pathname, datasetUrl)),
        pathToImages
      );
      const baseUrl = join(imageDirectory, imagePrefix);

      const fetchComponents = [...Array(numAtlases).keys()].map(idx => {
        const i = String(idx).padStart(numberingFormat.length, "0");
        const url = `${baseUrl}${i}.png`;
        return (
          <FetchImage
            key={i}
            url={url}
            fetchCallback={fetchInfo =>
              dispatch({ value: fetchInfo, index: idx })
            }
          />
        );
      });
      setFetches(fetchComponents);
    }
  }, [parameterData, datasetUrl, location.pathname]);

  useEffect(() => {
    if (converting) {
      const { sliceWidth, sliceHeight, numberOfImages } = parameterData;
      const [w, h, d] = [sliceWidth, sliceHeight, numberOfImages];
      const dataImage3d = new Uint8Array(w * h * d * 4);

      let converted = [false, false, false, false, false, false, false, false];

      for (let i = 0; i < imagesState.images.length; i++) {
        new PNG({ filterType: 4, inputHasAlpha: false }).parse(
          imagesState.images[i],
          (error, decodedImage) => {
            if (error !== null) {
              console.log(error);
            } else {
              // Would be nice to get updates about how much file has been parsed...
              // dispatch({ value: {progress: 0.875}, index: i });

              const atlasWidth = decodedImage.width;
              const atlasHeight = decodedImage.height;
              const paddedWidth = ceil2(sliceWidth);
              const paddedHeight = ceil2(sliceHeight);

              const slicesPerRow = Math.floor(atlasWidth / ceil2(sliceWidth));
              const xOffset = Math.floor((paddedWidth - sliceWidth) / 2);
              const yOffset = Math.floor((paddedHeight - sliceHeight) / 2);

              for (let z = i; z < numberOfImages; z += 8) {
                const locationIndex = Math.floor(z / 8);
                const xStart =
                  (locationIndex % slicesPerRow) * paddedWidth + xOffset;
                let yStart =
                  Math.floor(locationIndex / slicesPerRow) * paddedHeight +
                  yOffset;
                yStart = atlasHeight - yStart - paddedHeight + 2 * yOffset;
                const yEnd = yStart + sliceHeight;

                let row = 0;
                for (let y = yStart; y < yEnd; y++) {
                  // convert 2D coordinates to 1D coordinates
                  const readStart = (y * atlasWidth + xStart) * 4;
                  const readEnd = readStart + sliceWidth * 4;

                  const writeStart =
                    (sliceWidth * row + sliceWidth * sliceHeight * z) * 4;
                  dataImage3d.set(
                    decodedImage.data.slice(readStart, readEnd),
                    writeStart
                  );
                  row++;
                }

                converted[i] = true;
                dispatch({ value: { progress: 1 }, index: i });

                if (converted.every(done => done)) {
                  setMetadataCallback({
                    images: dataImage3d,
                    ...parameterData
                  });
                }
              }
            }
          }
        );
      }
    }
  }, [converting]);

  const totalProgress =
    (imagesState.progresses.reduce((a, b) => a + b, 0) * 100) / numAtlases;

  let statusText = "";
  let progressText = "";

  const downloadsFinished =
    imagesState.statuses.every(status => status === "SUCCESS") &&
    parameterData !== null;

  if (imagesState.statuses.some(status => status === "FAILED")) {
    statusText = "A fetch error occured. Please try refreshing the page!";
    progressText = ":(";
  } else if (downloadsFinished) {
    statusText = "Converting slices to 3D volume";
    progressText = "...";
    if (!converting) {
      setConverting(true);
    }
  } else {
    statusText = "Downloading 3D dataset image slices";
    progressText = `${totalProgress.toFixed(1)}%`;
  }

  return (
    <>
      {!downloadsFinished && fetches}
      <span>{statusText}</span>
      <span>{progressText}</span>
    </>
  );
};
