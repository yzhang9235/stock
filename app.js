const fs = require('fs'); //read csv file
const readline = require('readline');

const MongoClient = require('mongodb').MongoClient;
const connStr= "mongodb+srv://elaine:test123@cluster0.cwne72v.mongodb.net/library"
const client = new MongoClient(connStr);

async function run() {
    try {
        //connect to mongoDB
        await client.connect();
        console.log("connected");

        // use database
        const db = client.db("Stock");
        // find collection
        const collection = db.collection("Public Companies");

        //read data from csv file
        const fileStream = fs.createReadStream("companies.csv");

        //transform the file into a format that can be read line by line in a loop
        const lines = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of lines) {
            console.log("Read line:", line);
            const parts = line.split(',');
            const doc = {
                name: parts[0],
                ticker: parts[1],
                price: parseFloat(parts[2])
            };

            await collection.insertOne(doc);

        }
        console.log("Success!");
    } 
    catch (err) {
        console.log(err);
    } 
    finally {
        await client.close();
    }
}

run();