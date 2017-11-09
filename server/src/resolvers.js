import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';

let products = [];
let lastProductId = 0;
//let lastMessageId = 0;
let messageCreatedAt = 123456789;

function addProduct(args) {
  lastProductId++;
  const newProduct = {
    id: String(lastProductId),
    name: args.name,
    barcode : args.barcode,
    image : args.image,
    dataScadenza : args.dataScadenza
  };
  products.push(newProduct);
  return lastProductId;
}

function removeProduct(id){
  let itemToRemove = products.find(product => product.id === id);
  products = products.filter((product) => product.id !== id)
  return itemToRemove
}

function getProduct(id) {
  let test = Product
  return products.find(product => product.id === id);
}

/*
function addFakeProduct(args) {
  lastProductId++;
  const newProduct = {
    id:  String(lastProductId),
    name: args.name,
    barcode : args.barcode,
    image : args.image,
    dataScadenza : args.dataScadenza
  };
  products.push(newProduct);
}
*/
/*
// Add seed for consistent random data
faker.seed(9);
for (let i = 0; i < 10; i++) {
  addFakeProduct({
    name: faker.random.word(),
    barcode : faker.phone.phoneNumber(),
    image : faker.image.imageUrl(),
    dataScadenza : ''+faker.date.future()
  });
}*/
/*
// generate second channel for initial channel list view
addChannel('channel2');
*/

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    products: () => {
      return products;
    },

    product: (root, { id }) => {
      return getProduct(id);
    },
  },
  /*Channel: {
    messageFeed: (channel, { cursor }) => {
      if (!cursor) {
        cursor = channel.messages[channel.messages.length - 1].createdAt;
      }
      cursor = parseInt(cursor);
      let limit = 10;
      const newestMessageIndex = channel.messages.findIndex(
        message => message.createdAt === cursor
      );
      const newCursor = channel.messages[newestMessageIndex - limit].createdAt;
      let messageFeed = {
        messages: channel.messages.slice(
          newestMessageIndex - limit,
          newestMessageIndex
        ),
        cursor: newCursor,
      };
      return messageFeed;
    },
  },*/
  Mutation: {
    addProduct: (root, args) => {
      const info = {
        name : args.name,
        barcode : args.barcode,
        image : args.image,
        dataScadenza : args.dataScadenza
      };
      const id = addProduct(info);
      return getProduct(id);
    },
    removeProduct : (root, args)=>{
      return removeProduct(args.id);
    }
    /*addMessage: (root, { message }) => {
      const channel = channels.find(
        channel => channel.id === message.channelId
      );
      if (!channel) throw new Error('Channel does not exist');

      const newMessage = {
        id: String(lastMessageId++),
        text: message.text,
        createdAt: +new Date(),
      };
      channel.messages.push(newMessage);

      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId,
      });

      return newMessage;
    },*/
  },
  Subscription: {
    productAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('productAdded')
       /*(payload, variables) => {
          // The `messageAdded` channel includes events for all channels, so we filter to only
          // pass through events for the channel specified in the query
          return payload.channelId === variables.channelId;
        }*/
      ),
    },
  },
}
