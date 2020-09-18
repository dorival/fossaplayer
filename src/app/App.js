import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Sidebar from './components/sidebar/Sidebar';
import Player from './components/player/Player';
import HomePage from './components/home/HomePage';
import PlaylistPage from './components/playlist/PlaylistPage';
import CollectionPage from './components/collection/CollectionPage';

// import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <div className="App">
      <section>
        <Sidebar></Sidebar>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/playlist" component={PlaylistPage} />
            <Route exact path="/collection" component={CollectionPage} />
          </Switch>
        </Router>
      </section>
      <Player></Player>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
