import React from 'react';
import Search from './Search';
import SearchResults from './SearchResults';
import './App.css';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <header className="App-header">
        <p>
          Search for DCU past papers
        </p>
        <Search />
        <br />
        <SearchResults />
      </header>
    </div>
  );
}

export default App;
