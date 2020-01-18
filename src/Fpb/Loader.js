import React, {useEffect, useReducer, useState} from 'react';
import {useFetch} from 'loti-request';

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
    const image64 = btoa(new Uint8Array(data).reduce((out64, byte) => out64 + String.fromCharCode(byte), ''));
    image = `data:image/png;base64,${image64}`;
  }

  fetchCallback({progress: (progress.loaded / progress.total), status, image} );
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

  if (imagesState.statuses.some(status => status === "FAILED")){
    return <><span>A fetch error occured. Please try refreshing the page!</span></>
  }

  if (imagesState.statuses.every(status => status === "SUCCESS" && parameterData !== null)){
    setMetadataCallback({images: imagesState.images, ...parameterData});
    return <><span>All images loaded</span></>
  };

  const totalProgress = imagesState.progresses.reduce((a, b) => a + b, 0) * 100 / numAtlases;
  return <>{fetches}<span>{totalProgress.toFixed(1)}%</span></>;
}
