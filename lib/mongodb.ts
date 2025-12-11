import { MongoClient } from 'mongodb';

// Log the environment status (but not the actual URI)
console.log('MongoDB Environment Check:', {
  hasUri: !!process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
});

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to environment variables. Check: MONGODB_URI is missing.');
}

const uri = process.env.MONGODB_URI;

// Basic validation of the URI format
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB URI format. URI must start with mongodb:// or mongodb+srv://');
}

const options = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 