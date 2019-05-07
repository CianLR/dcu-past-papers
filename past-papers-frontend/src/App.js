import React from 'react';
import ReactGA from 'react-ga';
import Search from './Search';
import SearchResults from './SearchResults';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      resultsDisplayed: false,
    };
    ReactGA.initialize('UA-139742598-1');
    ReactGA.pageview('/');
    this.updateSearch = this.updateSearch.bind(this);
    this.updateResultsDisplayed = this.updateResultsDisplayed.bind(this);
  }

  updateSearch(newSearch) {
    ReactGA.event({
      category: 'User',
      action: 'Search',
    });
    this.setState({search: newSearch});
  }

  updateResultsDisplayed(resultsDisplayed) {
    this.setState({ resultsDisplayed });
  }

  render() {
    let image = null;
    if (!this.state.resultsDisplayed) {
      image = (
        <img src="test_blue.png" className="App-logo" alt="logo" />
      );
    }
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <header className="App-header">
          {image}
          <p>
            Search for DCU past papers
          </p>
          <Search searchCallback={this.updateSearch} />
          <br />
          <SearchResults
            search={this.state.search}
            resultsDisplayedCallback={this.updateResultsDisplayed}
          />
          <p className="App-githubtext">
            View this project on <a className="App-githublink" href="https://github.com/cianlr/dcu-past-papers">GitHub</a>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
