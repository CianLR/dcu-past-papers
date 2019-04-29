import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
    };
    this.textChange = this.textChange.bind(this);
    this.search = this.search.bind(this);
  }

  textChange(e) {
    this.setState({
      searchText: e.target.value,
    });
  }

  search(e) {
    this.props.searchCallback(this.state.searchText);
  }

  render() {
    return (
      <Paper className="search-paper" elevation={1}>
        <InputBase placeholder="Module Code" className="search-input" onChange={this.textChange} />
        <IconButton aria-label="Search" onClick={this.search}>
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  }
}

export default Search;
