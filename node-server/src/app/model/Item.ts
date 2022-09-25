import { AppDataSource } from "../db-access/datasource";

const { DataTypes, Model } = require('sequelize');

export class Item extends Model {}

Item.init({
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
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  // Other model options go here
  sequelize: AppDataSource.getAppDatabaseSource(), // We need to pass the connection instance
  modelName: 'item', // We need to choose the model name
  tableName: 'ITEMS' // The name of the table
});
