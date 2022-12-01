require('dotenv').config();
const  express = require("express");
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const router_user = require("./routers/user-router");
const router_post = require("./routers/post-router");
const router_comment = require("./routers/comment-router");
const errorMiddleware = require('./middlwares/error-middleware');
const PORT = process.env.PORT || 5000;


const app = express();

app.use("/uploads",express.static('uploads'))

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use("/", router_user,router_post,router_comment);
app.use(errorMiddleware);
const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        app.listen(PORT,()=>{
            console.log(`server starting on ${PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
}
start();