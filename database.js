const mongoose = require("mongoose");

class Database{

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://admin:dbuser@twitter-clone.paw1gfg.mongodb.net/?retryWrites=true&w=majority")
        .then(()=>{
            console.log("DB Connection Successful");
        })
        .catch((err)=>{
            console.log("DB Connection Failed "+err);
        })
    }
}

module.exports = new Database();