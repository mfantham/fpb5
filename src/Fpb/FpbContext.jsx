import create from 'zustand';

const [useStore, api] = create(set => ({
  loaded: 0,
  addToLoaded: (value) => set(state => ({loaded: state.loaded + value})),
  quality: 0.5,
  setQuality: (value) => set({quality: value}),
  intensity: 3,
}));

export {useStore, api};
