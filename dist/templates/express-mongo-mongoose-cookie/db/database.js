import mongoose from "mongoose";
const DB_NAME = "auth-mongo-cookie";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance)
    }
    catch (error) {
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1);
    }
};
export default connectDB;
