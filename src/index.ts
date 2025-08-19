#!/usr/bin/env node
import path from "path";
import dotenv from 'dotenv'
import express_mongo_mongoose_jwt from "./templates/express-mongo-mongoose-jwt/db/database.js";
import express_mongo_mongoose_cookie from "./templates/express-mongo-mongoose-cookie/db/database.js";
import { app } from "./app.js"



dotenv.config({
    path: './.env'
})

express_mongo_mongoose_jwt()
    .then(() => {

        // In Express.js, the .on() function is used to listen for events on an object, 
        // like a server or a stream.
        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server running on port ${process.env.PORT} 🔥`)
        });
    })
    .catch((error) => {
        console.log("MONGODB CONNECTION FAILED");
        console.log("ERROR", error)
        throw error
    })


express_mongo_mongoose_cookie()
    .then(() => {

        // In Express.js, the .on() function is used to listen for events on an object, 
        // like a server or a stream.
        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server running on port ${process.env.PORT} 🔥`)
        });
    })
    .catch((error) => {
        console.log("MONGODB CONNECTION FAILED");
        console.log("ERROR", error)
        throw error
    })