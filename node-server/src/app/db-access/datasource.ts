
import { environment } from '../../environments/environment';
import { MySQLDB } from './mysql-db';

export class AppDataSource{

    private static dbDataSource: any = null;

    public static getAppDatabaseSource(){
        if(this.dbDataSource===null){
            this.dbDataSource = MySQLDB.getConnexion(environment.dataBase);
        }
        return this.dbDataSource;
    }
}