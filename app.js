require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

//* Create our Express app
const app = express();

//* Take raw requests and turn them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//* use our own routes, starting with /api/v1
app.use('/api/v1', routes);

//* if above routes don't work, we 404 them and use error handler
app.use(errorHandlers.notFound);

//* One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

//* If it was an error not expected
if (app.get('env') === 'development') {
  //* Dev error - prints stack trace
  app.use(errorHandlers.developmentErrors);
}

//* export the app to use in the index.js
module.exports = app;
