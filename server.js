const express = require('express');
const app = express();
const path = require('path');


app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/users', (req, res, next)=> {
  let where = {};
  if(req.query.where){
    where = JSON.parse(req.query.where);
  }
  User.findAll({ where })
    .then( users => res.send(users))
    .catch(next);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));

const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/my_db');

const User = conn.define('user', {
  name: Sequelize.STRING,
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
});

const data = [
  { name: 'moe', active: true, state: 'NY', role: 'staff' },
  { name: 'larry', active: true, state: 'NJ', role: 'staff' },
  { name: 'curly', active: false, state: 'CT', role: 'other' },
  { name: 'shep', active: false, state: 'NJ', role: 'staff' },
];
conn.sync({ force: true })
  .then( ()=> {
    return Promise.all(data.map( user => User.create(user)));
  });
