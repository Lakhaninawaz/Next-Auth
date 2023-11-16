import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB Connected Successfully");
        })
        
        connection.on('error', (err) => {
            console.log("MongoDB Connection Error. please make sure MongoDB is running." + err);
            process.exit();
        })

    } catch (error) {
        console.log("Somthing goes wrong");
        console.log(error);
    }
}