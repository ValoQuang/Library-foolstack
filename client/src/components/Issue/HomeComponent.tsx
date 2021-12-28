import React, { Component } from 'react'

class Home extends Component {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div className="container mt-5 home text-center align-self-center">
        <div className="row mt-5 darkbg text-center justify-content-center">
          <h1> Welcome to the Q Library</h1>
        </div>
        <div className="row darkbg">
          <h6>
            username admin: director <br />
            password admin: director <br />
            Both type of users can search for book, check availibity <br />
            For admin route: can issue book, confirm return book, edit, remove
            book, see stats <br />
            For student route: can check book, search book
            <br />
            <br />{' '}
          </h6>
        </div>
        <div className="row darkbg justify-content-center">
          <table>
            <tr>
              {' '}
              <th>
                <h6>Library Timings</h6>
              </th>{' '}
            </tr>
            <tr>
              {' '}
              <td>
                <h6>Opening Time</h6>{' '}
              </td>{' '}
              <td>
                {' '}
                <h6>9.00 A.M.</h6>
              </td>
            </tr>
            <tr>
              {' '}
              <td>
                <h6>Closing Time</h6>{' '}
              </td>{' '}
              <td>
                {' '}
                <h6>9.00 A.M.</h6>
              </td>
            </tr>
          </table>
          <br />
          <br />
        </div>
      </div>
    )
  }
}
export default Home
