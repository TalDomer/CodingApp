import './App.css';
import {Routes, Route} from 'react-router-dom';
import Lobby from './components/Lobby';
import CodeBlock from './components/CodeBlock';


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element = {<Lobby />}  />
          <Route path="/codeblock/:codeName" element = {<CodeBlock />} />
      </Routes>
    </div>
  );
}

export default App;
