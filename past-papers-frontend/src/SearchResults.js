import React from 'react';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';
import superagent from 'superagent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import './SearchResults.css';

const RESULTS_PER_PAGE = 10;
const SEARCH_API = "/api/search";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      currentPage: 0,
      totalPages: 0,
      error: "",
    };
    this.generateRows = this.generateRows.bind(this);
    this.gotResults = this.gotResults.bind(this);
    this.gotError = this.gotError.bind(this);
    this.changePage = this.changePage.bind(this);
    this.makeSearchRequest = this.makeSearchRequest.bind(this);

    let {search} = props.match.params;
    if (search) {
      this.makeSearchRequest(search)
    }
  }

  componentWillReceiveProps(nextProps) {
    let currSearch = this.props.match.params.search
    let nextSearch = nextProps.match.params.search
    if (nextSearch === "" || nextSearch === currSearch) {
      return;
    }
    this.makeSearchRequest(nextSearch);
  }

  makeSearchRequest(search) {
    superagent
      .post(SEARCH_API)
      .send({search})
      .set('Accept', 'application/json')
      .then(resp => {
        this.gotResults(resp);
        this.props.addRecentCallback(search);
      })
      .catch(this.gotError);
    ReactGA.pageview(`/search/${search}`);
  }

  gotResults(resp) {
    let results = resp.body.results;
    ReactGA.event({
      'category': 'Search',
      'action': 'SearchSuccess',
    });
    this.setState({
      results,
      currentPage: 0,
      totalPages: resp.body.results.length / RESULTS_PER_PAGE,
      error: "",
    });
  }

  gotError(err) {
    this.setState({
      results: [],
      currentPage: 0,
      totalPages: 0,
      error: err.response.text,
    });
    ReactGA.event({
      'category': 'Search',
      'action': 'SearchError',
    });
  }

  generateRows() {
    const start = this.state.currentPage * RESULTS_PER_PAGE;
    const end = Math.min(
      (this.state.currentPage + 1) * RESULTS_PER_PAGE,
      this.state.results.length
    );
    let rows = this.state.results.slice(start, end).map((row, i) => (
      <TableRow key={i}>
        <TableCell>{row.code}</TableCell>
        <TableCell>{row.year}</TableCell>
        <TableCell><a href={row.link} target="_blank" rel="noopener noreferrer">Link</a></TableCell>
      </TableRow>
    ));
    return rows;
  }

  changePage(e, page) {
    this.setState({
      currentPage: page,
    });
  }

  render() {
    if (this.state.error !== "") {
      return (
        <div>
          <p>Error: {this.state.error}</p>
        </div>
      );
    }
    if (this.state.results.length === 0) {
      return null;
    }
    const rows = this.generateRows();
    let pagination = null;
    if (this.state.results.length > RESULTS_PER_PAGE) {
      pagination = (
        <TableRow>
          <TablePagination
            colSpan={3}
            rowsPerPageOptions={[]}
            page={this.state.currentPage}
            rowsPerPage={RESULTS_PER_PAGE}
            count={this.state.results.length}
            onChangePage={this.changePage}
          />
        </TableRow>
      );
    }
    return (
      <Paper className="table-paper">
        <Table className="table-paper">
          <TableHead className="table-paper">
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
          <TableFooter>
            {pagination}
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

export default withRouter(SearchResults);
