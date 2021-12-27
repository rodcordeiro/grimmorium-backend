import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes';
dotenv.config();

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/doc', (req, res) => {
  return res.render('html/index.html');
});
app.use(express.json());

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(cors(corsOptions));
app.use(routes);

const http = createServer(app);

export default http;
