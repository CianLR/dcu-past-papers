import React from 'react';
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
const SEARCH_API = "http://178.128.251.143:8081/api/search";

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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search === "" || this.props.search === nextProps.search) {
      return;
    }
    superagent
      .post(SEARCH_API)
      .send({search: nextProps.search})
      .set('Accept', 'application/json')
      .then(this.gotResults)
      .catch(this.gotError);
  }

  gotResults(resp) {
    let results = resp.body.results;
    results.sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return a.code.localeCompare(b.code);
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

export default SearchResults;
