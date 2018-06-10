import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';

const root = document.getElementById('root');


const Home = ()=> {
  return <h1>Home</h1>;
};

const Users = ()=> {
  return <h1>Users</h1>;
};


const Routes = ()=> {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/users'>Users</Link></li>
        </ul>
        <Route path='/' exact component= { Home } />
        <Route path='/users' exact component= { Users } />
      </div>
    </Router>
  );
};

render(<Routes />, root);
