/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import ReReact from './lib/rereact';
import ReReactDOM from './lib/rereact-dom';
import './App.css';

function App() {
  const [state, setState] = ReReactDOM.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

export default App;
