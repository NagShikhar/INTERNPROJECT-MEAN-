const mongoose = require("mongoose");
const dburl = "mongodb://0.0.0.0:27017/REGISTARTION";

mongoose.connect(dburl)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
