
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import methodOverride from 'method-override';

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

        app.use(methodOverride())
        app.use(this.logErrors);
        app.use(this.clientErrorHandler);
        app.use(this.errorHandler);

        console.log("Initialize request routing");
        new Router(app,contextPath).initRouting();

        console.log("Initialize DB");
        InitDB.createDBFromModel();
        
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }

    public logErrors(err:any, req:any, res:any, next:any) {
        console.error(err.stack)
        next(err)
    }

    public clientErrorHandler (err:any, req:any, res:any, next:any) {
        if (req.xhr) {
          res.status(500).send({ error: 'Something failed!' })
        } else {
          next(err)
        }
    }

    public errorHandler (err:any, req:any, res:any, next:any) {
        res.status(500)
        res.render('error', { error: err })
    }
}

new Server().start();