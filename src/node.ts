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
    const data = JSON.parse(readFileSync('./orders.json').toString()) as { items: Record<string, any>[], count: number };

    return { ...data, items: data.items.sort((a, b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0) };
  } catch {
    return { items: [], count: 1 };
  }
}

const write = (data: { items: Record<string, any>[], count: number }) => {
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

  write({ items: [ ...data.items, { ...req.body, number: data.count, date: new Date().valueOf() } ], count: data.count + 1 });

  res.send({});
});

app.patch('/api3', (req, res) => {
  const data = read();

  write({ ...data, items: data.items.map((i: any) => i.number === req.body.number ? { ...i, ready: req.body.ready } : i ) });

  res.send({});
});

app.put('/api3', (req, res) => {
  const data = read();

  write({ ...data, items: data.items.filter((i: any) => i.number !== req.body.number ) });

  res.send({});
});

app.delete('/api3', (req, res) => {
  write({ items: [], count: 1 });

  res.send({});
});

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT || 8082);