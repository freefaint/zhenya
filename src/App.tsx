import { DialogTitle, Paper, Typography, DialogContent, Fab, Dialog, FormControl, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useMatch } from 'react-router-dom';
import RecipeReviewCard from './components/card';

function App() {
  const match = useMatch('/:page');

  const page = useMemo(() => match?.params.page, [match]);

  return page === 'admin' ? <Admin /> : <Main />;
}

// function factory<T>(object: T & Record<string, string | number | boolean | Date>, count: number, key: string) {
//   return new Array(count).fill(object).map((i, j) => ({ ...i, [key]: j }));
// }

// const orders = factory({
//   date: new Date(),
//   number: 123,
//   size: 80,
//   model: 'Gucci',
//   description: 'Hello 123',
//   author: 'Zhenya',
//   price: 123,
//   ready: false,
// }, 100, 'number');

const getOrders = () => {
  return fetch('/api3')
    .then(resp => resp.json())
    .catch(e => void 0);
}
const createOrder = (body: any) => {
  return fetch('/api3', { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": 'application/json' } })
    .then(resp => resp.json())
    .catch(e => void 0);
}
const removeOrder = (body: any) => {
  return fetch('/api3', { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": 'application/json' } })
    .then(resp => resp.json())
    .catch(e => void 0);
}
const patchOrder = (body: any) => {
  return fetch('/api3', { method: "PATCH", body: JSON.stringify(body), headers: { "Content-Type": 'application/json' } })
    .then(resp => resp.json())
    .catch(e => void 0);
}

const Create = ({ handleCreate, handleClose }: { handleClose: () => void; handleCreate: (item: any) => void }) => {
  const [size, setSize] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');

  return (
    <Dialog open>
      <DialogTitle>
        Create
      </DialogTitle>

      <DialogContent>
        <FormControl>
          <TextField label="size" value={size} onChange={e => setSize(e.target.value)} />
        </FormControl>
        <FormControl>
          <TextField label="model" value={model} onChange={e => setModel(e.target.value)} />
        </FormControl>
        <FormControl>
          <TextField label="description" value={description} onChange={e => setDescription(e.target.value)} />
        </FormControl>
        <FormControl>
          <TextField label="author" value={author} onChange={e => setAuthor(e.target.value)} />
        </FormControl>
        <FormControl>
          <TextField label="price" value={price} onChange={e => setPrice(e.target.value)} />
        </FormControl>
      </DialogContent>

      <Button onClick={() => handleCreate({ size, model, description, author, price })}>Create</Button>
      <Button onClick={() => handleClose()}>Cancel</Button>
    </Dialog>
  )
}

const Admin = () => {
  const [data, setData] = useState<any[]>([]);
  const [timer, setTimer] = useState<number | void>();

  const [opened, setOpened] = useState(false);

  const load = useCallback(async () => {
    setData(await getOrders());
  }, []);

  useEffect(() => {
    load();
    setTimer(window.setInterval(load, 1000));

    return () => {
      setTimer(timer => window.clearInterval(timer!));
    }
  }, [load]);

  const handleClose = () => {
    setOpened(false);
  };

  const handleCreate = (item: any) => {
    createOrder(item);
    handleClose();
  };

  const handleRemove = (item: any) => {
    removeOrder(item);
  };

  const handleReady = (item: any) => {
    patchOrder(item);
  };
  
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      {opened && (
        <Create handleCreate={handleCreate} handleClose={handleClose} />
      )}

      {data?.map(i => (
        <RecipeReviewCard {...i} key={i.number} handleReady={handleReady} handleRemove={handleRemove} />
      ))}

      <Fab sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
      }} color="secondary" onClick={() => setOpened(true)}>
        <AddIcon />
      </Fab>
    </div>
  )
}

const Main = () => {
  const [data, setData] = useState<any[]>([]);
  const [timer, setTimer] = useState<number | void>();

  const load = useCallback(async () => {
    setData(await getOrders());
  }, []);

  useEffect(() => {
    load();
    setTimer(window.setInterval(load, 1000));

    return () => {
      setTimer(timer => window.clearInterval(timer!));
    }
  }, [load]);
  
  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", flexBasis: "50%" }}>
        <DialogTitle>В работе</DialogTitle>

        <DialogContent>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {data?.filter(i => !i.ready).map(i => (
              <Paper style={{ padding: "0.5rem", margin: "0 1rem 1rem 0", textAlign: "center" }}>
                <Typography variant="h6">{i.number}</Typography>
                <Typography>{i.author}</Typography>
              </Paper>
            ))}
          </div>
        </DialogContent>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flexBasis: "50%" }}>
        <DialogTitle>Готовы</DialogTitle>

        <DialogContent>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {data?.filter(i => i.ready).map(i => (
              <Paper style={{ width: "12rem", padding: "2rem", margin: "0 1rem 1rem 0", textAlign: "center" }}>
                <Typography variant="h1">{i.number}</Typography>
                <Typography variant="h6">{i.author}</Typography>
              </Paper>
            ))}
          </div>
        </DialogContent>
      </div>
    </div>
  )
}

export default App;
