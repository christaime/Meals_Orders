import { environment } from '../../environments/environment';

const { Sequelize } = require('sequelize');

export class MySQLDB{
    protected static connexion: any;
    public static getConnexion(params:{host: string, port: string,databaseName:string, user: string, password: string, pool:any}){
        if(this.connexion == null){
            try{
                const sequelize = new Sequelize(params.databaseName, params.user, params.password, {
                    host: params.host,
                    port: params.port,
                    dialect: 'mysql',
                    connectionTimeout: 3000,
                    requestTimeout: 3000,
                    stream: true,
                    pool: params.pool
                });
                this.connexion = sequelize;
               this.connexion.authenticate();
            }catch(exp){
                console.error("Mysql get connexion authetication fail!!!",exp);
            }
        }
        return this.connexion;
    }
}
