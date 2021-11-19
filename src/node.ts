// Env
// import fs from 'fs';
import http from 'http';
// import https from 'https';

// Libs
import express from 'express';
// import bodyParser from 'body-parser';
import { readFileSync, writeFileSync } from 'fs';

// Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const read = () => {
  try {
    return (JSON.parse(readFileSync('./orders.json').toString()) as any[]).sort((a, b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0);
  } catch {
    return [];
  }
}

const write = (data: Record<string, any>[]) => {
  try {
    return writeFileSync('./orders.json', JSON.stringify(data));
  } catch {
    return writeFileSync('./orders.json', '[]');
  }
}

app.use('/api3', function(req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  next();
});

app.get('/api3', (req, res) => {
  const data = read();

  res.send(data);
});

app.post('/api3', (req, res) => {
  const data = read();

  write([ ...data, { ...req.body, number: data.length ? Math.max(...data.map((i: any) => i.number)) + 1 : 1, date: new Date().valueOf() } ]);

  res.send({});
});

app.patch('/api3', (req, res) => {
  const data = read();
  write(data.map((i: any) => i.number === req.body.number ? { ...i, ready: req.body.ready } : i ));

  res.send({});
});

app.put('/api3', (req, res) => {
  const data = read();

  write(data.filter((i: any) => i.number !== req.body.number ));

  res.send({});
});

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT || 8082);