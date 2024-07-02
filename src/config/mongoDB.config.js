import * as mongoose from "mongoose";
import constants from "./constants.js";


const connectDB = async () => {
    if (!constants.MONGODB_URI){
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(constants.MONGODB_URI);
    console.log("MongoDB connected successfully");
}

export default connectDB;