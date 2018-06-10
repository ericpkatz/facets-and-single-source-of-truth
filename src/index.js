import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import _ from 'underscore';
import axios from 'axios';

const root = document.getElementById('root');


const Home = ()=> {
  return <h1>Home</h1>;
};

const generateFilter = (search)=> {
  const prefix = 'where=';
  const unencoded = decodeURI(search);
  const pairs = unencoded.slice(1).split('&');
  const pair = pairs.find( pair => pair.indexOf(prefix) === 0);
  const filter = pair.split('=')[1];
  return JSON.parse(filter);
};

class Users extends Component{
  constructor({ location }){
    super();
    const filter = generateFilter(location.search);
    this.state = {
      filter,
      users: []
    };
    this.onChange = this.onChange.bind(this);
    this.load = this.load.bind(this);
    this.load(filter);
  }
  load(filter){
    const cleanFilter = Object.keys(filter).reduce((memo, key)=> {
      if(filter[key]){
        const val = filter[key];
        const isBool = val === 'true' || val === 'false';
        memo[key] = isBool ? Boolean(val) : val;
      }
      return memo;
    }, {});
    axios.get(`/api/users?where=${JSON.stringify(cleanFilter)}`)
      .then( result => result.data)
      .then( users => this.setState({ users }));
  }
  onChange(ev){
    const change = {};
    change[ev.target.name] = ev.target.value;
    const filter = Object.assign({}, this.state.filter, change); 
    this.props.history.push(`/users?where=${JSON.stringify(filter)}`);
  }
  componentWillReceiveProps(nextProps){
    const filter = generateFilter(nextProps.location.search);
    if(!_.isEqual(filter, this.state.filter)){
      this.setState({ filter });
      this.load(filter);
    }
  }
  render(){
    const { onChange } = this;
    const { filter, users } = this.state;
    return (
      <_Users filter={ filter } onChange={ onChange } users={ users }/>
    );
  }
}

const Facet = ({ options, name, filter, onChange })=> {
  return (
    <div>
      Facet for { name }
      <br />
      <select name={ name } value={ filter[name] } onChange = { onChange }>
        {
          options.map( option => <option key={ option.value } value={ option.value }>{ option.text }</option>)
        }
      </select>
    </div>
  );
};

const activeOptions = [
  { text: 'all', value: '' },
  { text: 'active', value: true },
  { text: 'inactive', value: false },
];

const stateOptions = [
  { text: 'all', value: '' },
  { text: 'New York', value: 'NY' },
  { text: 'New Jersey', value: 'NJ' },
  { text: 'Connecticut', value: 'CT' },
];

const roleOptions = [
  { text: 'all', value: '' },
  { text: 'Staff', value: 'staff' },
  { text: 'Admin', value: 'admin' },
  { text: 'Other', value: 'other' },
];

const _Users = ({ filter, onChange, users })=> {
  return (
    <div>
      <h1>Users</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: 'solid 1px black'}}>
        <Facet options={ activeOptions } name='active' filter={ filter } onChange={ onChange }/>
        <Facet options={ stateOptions } name='state' filter={ filter }  onChange={ onChange } />
        <Facet options={ roleOptions } name='role' filter={ filter }   onChange={ onChange }/>
      </div>
      <ul>
      {
        users.map( user => (
          <li key={ user.id } style={{ display: 'flex', justifyContent: 'space-around'}}>
            <div style={{ flex: 1 }}>
              { user.name }
            </div>
            <div style={{ flex: 1 }}>
              { user.active ? 'active': 'inactive'}
            </div>
            <div style={{ flex: 1 }}>
              { user.state }
            </div>
            <div style={{ flex: 1 }}>
              { user.role }
            </div>
          </li>
        ))

      }
      </ul>
    </div>
  );
};

const defaultFilter = {
};

const Routes = ()=> {
  return (
    <Router>
      <div>
        <ul style={{ display: 'flex'}}>
          <li style={{ flex: 1}}><Link to='/'>Home</Link></li>
          <li style={{ flex: 1}}><Link to={`/users?where=${JSON.stringify(defaultFilter)}`}>Users</Link></li>
        </ul>
        <Route path='/' exact component= { Home } />
        <Route path='/users' exact component= { Users } />
      </div>
    </Router>
  );
};

render(<Routes />, root);
