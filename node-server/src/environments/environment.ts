export const environment = {
    dataBase:{
        host: "localhost",
        port:"3306",
        databaseName:"mealsOrders",
        user: "mealsOrdersUser", 
        password: "mealsOrdersUserSecret",
        pool: {
            max: 15,
            min: 0,
            acquire: 30000,
            idle: 10000 
        }
    }
}