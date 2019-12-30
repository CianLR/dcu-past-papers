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
    this.renderShareLink = this.renderShareLink.bind(this);
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

  renderShareLink() {
    let link = (<span>sharing it</span>);
    if (navigator.share) {
      let share = (e) => {
        e.preventDefault();
        navigator.share({
          'title': 'DCU Past Papers',
          'url': 'https://dcupastpapers.xyz/?utm_source=social&utm_medium=sharelink&utm_campaign=web',
        })
          .then(() => ReactGA.event({category: 'User', action: 'Share'}))
          .catch((error) => console.log("Error sharing:", error));
      };
      link = (<a href="/" className="App-githublink" onClick={share}>sharing it</a>);
    }
    return (
      <p className="App-githubtext">
        Would your groupchat find this useful?
        Consider {link}.
      </p>
    );
  }

  render() {
    let image = null;
    if (!this.state.resultsDisplayed) {
      image = (
        <img src="test_blue.png" className="App-logo" alt="logo" />
      );
    }
    let shareLink = this.renderShareLink();
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
          {shareLink}
          <p className="App-githubtext">
            View this project on <a className="App-githublink" href="https://github.com/cianlr/dcu-past-papers">GitHub</a>.
          </p>
        </header>
      </div>
    );
  }
}

export default App;
