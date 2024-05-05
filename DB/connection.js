// import mongoose from "mongoose";
// const connectDB = async () => {
// return await mongoose.connect(process.env.DB).then(() => {

// console.log("connected successfully");
// }).catch((err) => {
// console.log(`error to connect db ${err}`);
// });
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;
