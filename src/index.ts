// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import {connectDB} from "./templates/express-mongo-jwt/db/database.js";
import { app } from "./app.js"



dotenv.config({
    path: './.env'
})

connectDB()
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
