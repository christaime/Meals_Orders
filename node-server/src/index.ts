
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { Router } from './app/rest/router';
import { InitDB } from './app/model/init.db';

class Server{

    public start(){
        const app = express();
        const port = 3000;
        const contextPath = "/api";

        // Cors configuration
        const corsOptions = {
            origin: "*"
        };
        app.use(cors(corsOptions));
        
        // parse requests of content-type - application/json        
        app.use(bodyParser.json());


        console.log("Initialize request routing");
        new Router(app,contextPath).initRouting();

        console.log("Initialize DB");
        InitDB.createDBFromModel();
        
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }
}

new Server().start();