//jshint esversion:6

// Connection URL
const CONNECTION_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "blog-website-pure-mdb";
const COLLECTION_NAME = "posts";

const { MongoClient } = require("mongodb");

// Create a new MongoClient
const client = new MongoClient(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var database, collection;

module.exports = {
  connect: async function() {
    try {
      // Connect the client to the server
      await client.connect();
      // Establish and verify connection
      database = await client.db(DATABASE_NAME);
      collection = database.collection(COLLECTION_NAME);
      console.log("Connected to " + DATABASE_NAME);
    } catch(err) {
      // Ensures that the client will close when you finish/error
      console.error(err);
    }
  },

  getAll: async function() {
    const cursor = collection.find({});
    // return dummy post if no documents were found
    if ((await cursor.count()) === 0) {
      return {title: "No any posts", content: "Compose one."}
    }
    const allValues = await cursor.toArray();

    return allValues;
  },

  getByTitle: async function(title) {
    // Query for a movie that has the title 'The Room'
    const query = { title: title };
    const post = await collection.findOne(query);
    return post;
  },

  insert: async function(post) {
    const result = await collection.insertOne(post);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  },

  disconnect: async function() {
    await client.close();
  }
}
