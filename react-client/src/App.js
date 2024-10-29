import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';

import Plotmobile from './pages/Plotmobile'
import landing from './pages/Landing';
import Brain from './pages/Brain';
import ThreeScene from './pages/ThreeScene';
import View from './pages/View';

axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
              <Route path="/plotmobile" exact Component={Plotmobile} />
              <Route path="/" exact Component={landing} />
              <Route path="/brain" exact Component={Brain} />
              <Route path="/3js" exact Component={ThreeScene} />
              <Route path="view" exact Component={View} />
            </Routes>
          </Router>
      </div>
  );
}

export default App;
