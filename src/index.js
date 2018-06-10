import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import _ from 'underscore';

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
      filter
    };
    console.log('load data for ', filter);
    this.onChange = this.onChange.bind(this);
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
      console.log('load data for ', filter);
    }
  }
  render(){
    const { onChange } = this;
    const { filter } = this.state;
    return (
      <_Users filter={ filter } onChange={ onChange }/>
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

const _Users = ({ filter, onChange })=> {
  return (
    <div>
      <h1>Users</h1>
      <Facet options={ activeOptions } name='active' filter={ filter } onChange={ onChange }/>
      <Facet options={ stateOptions } name='state' filter={ filter }  onChange={ onChange } />
      <Facet options={ roleOptions } name='role' filter={ filter }   onChange={ onChange }/>
    </div>
  );
};

const defaultFilter = {
  active: true,
  state: 'NY',
  role: 'admin'
};

const Routes = ()=> {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to={`/users?where=${JSON.stringify(defaultFilter)}`}>Users</Link></li>
        </ul>
        <Route path='/' exact component= { Home } />
        <Route path='/users' exact component= { Users } />
      </div>
    </Router>
  );
};

render(<Routes />, root);
