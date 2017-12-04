
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './data/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import multer from 'multer';
import path from 'path';
import { networkInterfaces } from 'os'

const getLocalExternalIp = () => [].concat.apply([], Object.values(networkInterfaces()))
  .filter(details => details.family === 'IPv4' && !details.internal)
  .pop().address

const LocalExternalIp = getLocalExternalIp();

const PORT = 4000;
const server = express();
server.use('*', cors());

/* UPLOAD FILE TO DIR */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './productsFiles')
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage }).single('file');

server.post('/files', (req, res) => {
 
  upload(req, res ,function(err){
    if (err) {
      return res.end("Something went wrong!");
    }
    return res.end("File uploaded sucessfully!.");
  })
  }
)

server.use('/files', express.static(path.join(__dirname, 'productsFiles')))

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
  //subscriptionsEndpoint: `ws://${LocalExternalIp}:4000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://${LocalExternalIp}:${PORT}`);
});

new SubscriptionServer({
  execute,
  subscribe,
  schema
}, {
  server: ws,
  path: '/subscriptions',
});

/*DB initialization*/
/*
sqlite.open('keeper.sqlite', { cached: true })
.then(() => sqlite.run('PRAGMA foreign_keys=on'))
.then(() => sqlite.migrate())
.then(() => {

  server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
  }));

  server.use('/graphql', bodyParser.json(), graphqlExpress({
    graphiql: true,
    pretty: true,
    schema,
    rootValue,
    context: {
      db: {
        get: (...args) => sqlite.get(...args),
        all: (...args) => sqlite.all(...args),
        run: (...args) => sqlite.run(...args)
      }
    }
  }));
  // We wrap the express server so that we can attach the WebSocket for subscriptions
  const ws = createServer(server);

  ws.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    });
  });
})
.catch(error=>console.log(error))
*/