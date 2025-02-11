const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Tạo class ConnectMongo
class ConnectMongo {
    constructor() {
        this._connect();
    }
    _connect() {
        const env = process.env.ENV;
        let connectionString = "";

        if (env === "prod") {
            connectionString = process.env.CONNECTION_STRING_DATABASE_PROD;
        } else if (env === "dev") {
            connectionString = process.env.CONNECTION_STRING_DATABASE_DEV;
        }
        else if (env === "qc") {
            connectionString = process.env.CONNECTION_STRING_DATABASE_QC;
        }
        else {
            console.error("Unknown environment. Please set the ENV variable to 'prod' or 'dev'.");
            return;
        }

        console.log(`Connecting to: ${connectionString}`);
        if (!connectionString) {
            console.error("Connection string is undefined. Please check your .env file.");
            return;
        }

        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log("connect success");
            })
            .catch((err) => {
                console.log("connect fail");
                console.log(err);
            });
    }
}

// Export an instance of the ConnectMongo class
module.exports = new ConnectMongo();
