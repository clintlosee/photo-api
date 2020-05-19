require('dotenv').config();
const mongoose = require('mongoose');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(
    "🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou're on an older version of node that doesn't support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n "
  );
  process.exit();
}

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to DB'));

const app = require('./app');

app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Server running → PORT ${server.address().port}`);
});
