const client = require("./client");


const dbConnection = async () => {
    try
    {
        await client.connect();
        console.log('Connected to database');
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports = dbConnection;