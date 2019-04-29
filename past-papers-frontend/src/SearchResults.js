import React from 'react';
import superagent from 'superagent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './SearchResults.css';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [
        {code: "CA4003", year: '2017', link: "google.com"},
        {code: "CA4003", year: '2017R', link: "bing.com"},
      ],
    };
    this.generateRows = this.generateRows.bind(this);
    this.gotResults = this.gotResults.bind(this);
    this.gotError = this.gotError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search === "" || this.props.search === nextProps.search) {
      return;
    }
    superagent
      .post('http://localhost:5000/api/search')
      .send({search: nextProps.search})
      .set('Accept', 'application/json')
      .then(this.gotResults)
      .catch(this.gotError);
  }

  gotResults(resp) {
    this.setState({
      results: resp.body.results,
    });
  }

  gotError(err) {
    alert(err.message);
    this.setState({
      results: [],
    });
  }

  generateRows() {
    return this.state.results.map((row, i) => (
      <TableRow key={i}>
        <TableCell>{row.code}</TableCell>
        <TableCell>{row.year}</TableCell>
        <TableCell><a href={row.link} target="_blank" rel="noopener noreferrer">Link</a></TableCell>
      </TableRow>
    ));
  }

  render() {
    if (this.state.results.length === 0) {
      return null;
    }
    const rows = this.generateRows();
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
        </Table>
      </Paper>
    );
  }
}

export default SearchResults;
