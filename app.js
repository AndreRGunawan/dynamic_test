if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  if (err.name == 'SequelizeValidationError') {
    const errors = err.errors.map(el => {
      return {
        message: el.message
      };
    });
    return res.status(400).json({
      errors
    });
  } else if (err.name == 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(el => {
      return {
        message: el.message
      };
    });
    return res.status(400).json({
      errors
    });
  } else {
    return res.status(500).json(err);
  }
});

module.exports = app;
