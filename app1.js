var http = require("http");
var url = require("url");
var fs = require("fs");
const { MongoClient } = require('mongodb');

const connStr = "mongodb+srv://elaine:test123@cluster0.cwne72v.mongodb.net/";
const client = new MongoClient(connStr);

async function main() {
    //connect to mongodb
    await client.connect();
    console.log("MongoDB connected");
}
main();

http.createServer(async function(req, res) {
    var urlObj = url.parse(req.url, true);
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(urlObj.pathname == "/") {
        //read formtext.txt and make it as the web content
        fs.readFile("formtext.txt", "utf8", function(err, data) {
            res.write(data);
            res.end();
        });
    }

    else if(urlObj.pathname == "/process") {
        //conenct to mongoDB database and collection 
        const db = client.db("Stock");
        const collection = db.collection("Public Companies");

        let search = urlObj.query.search;
        let type = urlObj.query.type;

        let query = {};
        // if user searches by ticker symbol
        if(type == "ticker") {
            query = { ticker: search };
        //if user searches by company name
        } else {
            query = { name: search };
        }

        // query collection
        const results = await collection.find(query).toArray();
        //print results in console
        console.log(results);

        // display each item in certain format
        res.write("<h1>Results</h1>");
        results.forEach(r => {
            res.write(`
                <p>${r.name} | ${r.ticker} | $${r.price}</p>
            `);
        });

        res.end();
    }
const PORT = process.env.PORT || 8080;
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);