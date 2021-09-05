require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoose from 'mongoose';
import {UserRouter} from './routers/user-route';
import morgan from 'morgan';
import {MessageRouter} from './routers/message-route';

const port = process.env.PORT || 3001;
const app: express.Application = express();

//@ts-ignore
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan('BEFORE :method :url :status :response-time ms - :res[content-length] :body - :req[content-length]', {
    immediate: true,
  }),
);
app.use(
  morgan('AFTER :method :url :status', {
    immediate: false,
  }),
);

app
  .set('port', port)
  .disable('etag')
  .disable('x-powered-by')
  .use(cookieParser())
  .use(express.json())
  .use('/user', UserRouter())
  .use('/message', MessageRouter());

if (process.env.NODE_ENV != 'dev') {
  console.log('NOT DVE', process.env.NODE_ENV);
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../../', 'client/build/index.html'));
  });
}

// const pass = config.pass;
// const user = config.user;
// const dbRoute = `mongodb+srv://${user}:${pass}@cluster0-hoja9.mongodb.net/test?retryWrites=true&w=majority`;

// connects our back end code with the database
mongoose.connect(process.env.MONGO_URI!);

const db = mongoose.connection;
db.once('open', () => console.info('Connected to the database.')) //
  .on('error', () => console.error('MongoDB connection error:'));

app.get('/error', function (req, res) {
  throw new Error('Problem Here!');
});

// All errors are sent back as JSON
app
  .use((err: any, req: any, res: any, next: any) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    return res.status(400).json({error: err.message});
  })
  .listen(port, () => console.info('Example app listening on port ' + port));
