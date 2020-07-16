import React from 'react';
import {BrowserRouter, Switch, Link, Route} from 'react-router-dom';
import ReactGA from 'react-ga';
import Search from './Search';
import SearchResults from './SearchResults';
import './App.css';

// Enable the social sharing text.
const SHARE_LINK = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    let recent = JSON.parse(localStorage.getItem("recentSearches"));
    this.state = {
      recentSearches: recent ? recent : [],
    };
    ReactGA.initialize('UA-139742598-1');
    ReactGA.pageview('/');
    this.renderShareLink = this.renderShareLink.bind(this);
    this.addNewSearch = this.addNewSearch.bind(this);
    this.renderRecentSearches = this.renderRecentSearches.bind(this);
  }

  renderShareLink() {
    if (!SHARE_LINK) {
      return null;
    }
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

  addNewSearch(search) {
    let recent = this.state.recentSearches;
    if (!recent) {
      recent = [];
    }
    if (recent.includes(search)) {
      // Promote the search to the front.
      recent.splice(recent.indexOf(search), 1);
      recent.unshift(search);
    } else {
      // Append to the front, limiting to 3 searches.
      recent.unshift(search);
      if (recent.length > 3) {
        recent.pop();
      }
    }
    localStorage.setItem("recentSearches", JSON.stringify(recent));
    this.setState({recentSearches: recent});
  }

  renderRecentSearches() {
    if (this.state.recentSearches.length === 0) {
      return null;
    }
    let searchLinkFunc = (s, i) => {
      return (
        <span key={i}>
          <Link
            className="App-githublink"
            to={`/search/${s}`}
            onClick={e => ReactGA.event({category: 'User', action: 'RecentSearchClick'})}
          >
            {s}
          </Link>
        {i === this.state.recentSearches.length - 1 ? '.' : ', '}
        </span>
      );
    }
    return (
      <p>
        Recent searches:&nbsp;
        {this.state.recentSearches.map(searchLinkFunc)}
      </p>
    );
  }

  render() {
    let image = (
      <img src="/test_blue.png" className="App-logo" alt="logo" />
    );
    let recentSearches = this.renderRecentSearches();
    let shareLink = this.renderShareLink();
    return (
      <BrowserRouter>
        <div className="App">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <header className="App-header">
            <Switch>
              <Route path="/search/:search" />
              <Route
                path="/"
                render={() => image}
              />
            </Switch>
            <p>
              Search for DCU past papers
            </p>
            <Search/>
            <br />
            {recentSearches}
            <Switch>
              <Route
                path="/search/:search"
                render={props => <SearchResults {...props} addRecentCallback={this.addNewSearch} />}
              />
              <Route path="/" />
            </Switch>
            {shareLink}
            <p className="App-githubtext">
              View this project on <a className="App-githublink" href="https://github.com/cianlr/dcu-past-papers">GitHub</a>.
            </p>
          </header>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
