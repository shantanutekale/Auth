import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/connection.js'
import router from './router/route.js'
import bodyParser from 'body-parser'

const app =express();
/* middlewares */
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-poweres-by');//less hackers know about our stack

const port = 8080;
app.get('/',(req,res)=>{
    res.status(201).json("Home Get Request")
})
//api routes 
app.use('/api',router)

//start connection when we have valid connection

connect().then(()=>{
    try{

        app.listen(port,()=>{
            console.log(`server is running on port ${port}`);
        })

    }catch (error){
        console.log("can not connect to server")

    }
}).catch(error =>{
    console.log("invalid database connection")
})


