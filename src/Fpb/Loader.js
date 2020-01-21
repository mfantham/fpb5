import React, {useEffect, useReducer, useState} from 'react';
import {useFetch} from 'loti-request';

import {PNG} from 'pngjs';

const ceil2 = v => {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
}

const FetchParameters = ({datasetName, fetchCallback}) => {
  const url = `demo/${datasetName}.json`;
  const fetchHook = useFetch({url: url, responseType: 'json'});
  const {status, data} = fetchHook;
  if (status === 'FAILED'){
    return <span>Failed to fetch <pre>${datasetName}.json</pre></span>;
  }
  if (status === 'SUCCESS'){
    fetchCallback(data);
  }

  return null;
}

const FetchImage = ({url, fetchCallback}) => {
  const fetchHook = useFetch({url: url, withProgress: true, responseType: 'arraybuffer'});
  const {status, progress, data} = fetchHook;
  let image = null;
  if (status === 'SUCCESS'){
    image = data;
  }

  fetchCallback({progress: (progress.loaded / progress.total / 2), status, image} );
  return null;
}

const imageReducer = (state, action) => {
  let newProgresses = [...state.progresses];
  let newStatuses = [...state.statuses];
  let newImages = [...state.images];

  newProgresses[action.index] = action.value.progress;
  newStatuses[action.index] = action.value.status;
  newImages[action.index] = action.value.image;
  return {progresses: newProgresses, statuses: newStatuses, images: newImages};
}

const initialReducerState = (numAtlases) => {
  const initialProgresses = new Array(numAtlases).fill(0);
  const initialStatuses = new Array(numAtlases).fill('NOT_SEND');
  const initialImages = new Array(numAtlases).fill(null);
  return {progresses: initialProgresses, statuses: initialStatuses, images: initialImages};
}

export default ({datasetName, setMetadataCallback}) => {
  const numAtlases = 8;

  const [parameterData, setParameterData] = useState(null);
  const [fetches, setFetches] = useState(null);
  const [converting, setConverting] = useState(false);
  const [imagesState, dispatch] = useReducer(imageReducer, initialReducerState(numAtlases));

  useEffect(() => {
    setFetches(<FetchParameters datasetName={datasetName} fetchCallback={pData => setParameterData(pData)} />);
  }, [datasetName]);

  useEffect(() => {
    if (parameterData !== null){
      const {pathToImages, imagePrefix, numberingFormat} = parameterData;
      const baseUrl = `${pathToImages}/${imagePrefix}`;

      const fetchComponents = [...Array(numAtlases).keys()].map(idx => {
        const i = String(idx).padStart(numberingFormat.length, "0");
        const url = `${baseUrl}${i}.png`;
        return <FetchImage key={i} url={url} fetchCallback={fetchInfo => dispatch({value: fetchInfo, index: idx})} />;
      });
      setFetches(fetchComponents);
    }
  }, [parameterData]);

  useEffect(() => {
    if (converting) {
      const {sliceWidth, sliceHeight, numberOfImages} = parameterData;
      const [w, h, d] = [sliceWidth, sliceHeight, numberOfImages];
      const dataImage3d = new Uint8Array(w * h * d * 4);

      let converted = [false, false, false, false, false, false, false, false];

      for (let i = 0; i < imagesState.images.length; i++){
        new PNG({ filterType:4, inputHasAlpha: false }).parse(imagesState.images[i], (error, decodedImage) => {
          if (error !== null ){
            console.log(error);
          } else {
              const atlasWidth = decodedImage.width;
              const atlasHeight = decodedImage.height;
              const paddedWidth = ceil2(sliceWidth);
              const paddedHeight = ceil2(sliceHeight);

              const slicesPerRow = Math.floor(atlasWidth/ceil2(sliceWidth));
              const xOffset = Math.floor((paddedWidth - sliceWidth)/2);
              const yOffset = Math.floor((paddedHeight - sliceHeight)/2);

            for (let z = i; z < numberOfImages; z+=8){
              const locationIndex = Math.floor(z / 8);
              const xStart = locationIndex % slicesPerRow * paddedWidth + xOffset;
              let yStart = Math.floor(locationIndex / slicesPerRow) * paddedHeight + yOffset;
              yStart  = atlasHeight - yStart - paddedHeight + 2*yOffset;
              const yEnd = yStart + sliceHeight;

              let row = 0;
              for (let y = yStart; y < yEnd; y++){
                // convert 2D coordinates to 1D coordinates
                const readStart = (y * atlasWidth + xStart) * 4 ;
                const readEnd = readStart + sliceWidth * 4;

                const writeStart = (sliceWidth * row + sliceWidth * sliceHeight * z) * 4;
                dataImage3d.set(decodedImage.data.slice(readStart, readEnd), writeStart);
                row++;
              }

              converted[i] = true
              if (converted.every(done => done)){
                setMetadataCallback({images: dataImage3d, ...parameterData});
              }
            }
          }
        });
      }
    } else {
      // do nothing.
    }
  }, [converting]);

  if (imagesState.statuses.some(status => status === "FAILED")){
    return <><span>A fetch error occured. Please try refreshing the page!</span></>
  }

  if (imagesState.statuses.every(status => status === "SUCCESS" && parameterData !== null)){
    if (!converting){
      setConverting(true);
    }
    return <><span>Slices converting to 3D volume</span></>
  };

  const totalProgress = imagesState.progresses.reduce((a, b) => a + b, 0) * 100 / numAtlases;
  return <>{fetches}<span>{totalProgress.toFixed(1)}%</span></>;
}
