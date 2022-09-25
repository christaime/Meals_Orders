import { AppDataSource } from "../db-access/datasource";

const { Sequelize, DataTypes, Model } = require('sequelize');

export class Customer extends Model {}

Customer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize: AppDataSource.getAppDatabaseSource(), // We need to pass the connection instance
  modelName: 'customer', // We need to choose the model name
  tableName: 'CUSTOMERS' // The name of the table
});
