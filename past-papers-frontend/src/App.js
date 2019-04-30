import React from 'react';
import Search from './Search';
import SearchResults from './SearchResults';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
    this.updateSearch = this.updateSearch.bind(this)
  }

  updateSearch(newSearch) {
    this.setState({search: newSearch});
  }

  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <header className="App-header">
          <p>
            Search for DCU past papers
          </p>
          <Search searchCallback={this.updateSearch} />
          <br />
          <SearchResults search={this.state.search} />
          <p className="App-githubtext">
            View this project on <a className="App-githublink" href="https://github.com/cianlr/dcu-past-papers">GitHub</a>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
