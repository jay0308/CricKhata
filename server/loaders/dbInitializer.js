

const {MongoClient} = require('mongodb');
let client;

async function listDatabases(client){
    let databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = `mongodb://${process.env.DB_URL}/crickhatadb?retryWrites=true&w=majority`;
 

    client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
        return client;
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = {
    initialize:main,
    client:client
}