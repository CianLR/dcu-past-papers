import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import './Search.css';

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
  }

  generateRows() {
    return this.state.results.map(row => (
      <TableRow>
        <TableCell>{row.code}</TableCell>
        <TableCell>{row.year}</TableCell>
        <TableCell><a href={row.link}>Link</a></TableCell>
      </TableRow>
    ));
  }

  render() {
    if (this.state.results.length === 0) {
      return null;
    }
    const rows = this.generateRows();
    return (
      <Paper>
        <Table>
          <TableHead>
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
