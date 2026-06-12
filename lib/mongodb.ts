import { MongoClient } from 'mongodb';
import { getMongoBaseURL } from './server/utils';
// import dns from "node:dns/promises";
// dns.setServers(["1.1.1.1"]);
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getMongoClient() {
  const uri = await getMongoBaseURL();
  if (!uri) {
    throw new Error('MongoDB URI could not be loaded');
  }

  const client = new MongoClient(uri);

  return client.connect();
}

const clientPromise = global._mongoClientPromise ?? getMongoClient();

if (process.env.NODE_ENV !== 'production') {
  global._mongoClientPromise = clientPromise;
}

export default clientPromise;
