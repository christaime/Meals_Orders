import { AppDataSource } from "../db-access/datasource";
import { Customer } from "./Customer";
import { Item } from "./Item";

const { DataTypes, Model } = require('sequelize');

export enum OrderStatus{
    CREATED,
    CANCELLED,
    READY,
    SHIPPED
  }
  
  export enum PaymantStatus {
    PENDING,
    PAID
  }

export class Order extends Model {

}
Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  oderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: OrderStatus[OrderStatus.CREATED]
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: PaymantStatus[PaymantStatus.PENDING]
  },
  customerCode: {
    type: DataTypes.VIRTUAL,
    get(this:Order): string {
        return this.customer?.code;
    }
  },
  customerName: {
    type: DataTypes.VIRTUAL,
    get(this:Order): string {
        return this.customer?.name;
    }
  }
}, {
  // Other model options go here
  sequelize: AppDataSource.getAppDatabaseSource(), // We need to pass the connection instance
  modelName: 'order', // We need to choose the model name
  tableName: 'ORDERS' // The name of the table
});

export class OrderItem extends Model {
}
OrderItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    itemCode: {
      type: DataTypes.VIRTUAL,
      get(this:Order): string {
          return this.item?.code;
      }
    },
    itemName: {
      type: DataTypes.VIRTUAL,
      get(this:Order): string {
          return this.item?.name;
      }
    }
  }, {
    // Other model options go here
    sequelize: AppDataSource.getAppDatabaseSource(), // We need to pass the connection instance
    modelName: 'orderItem', // We need to choose the model name
    tableName: 'ORDERS_ITEMS' // The name of the table
  });

  /**
   * Order association with Customer
   */
Order.belongsTo(Customer,{
    foreignKey: {
        name:  'customerId',
        allowNull: false
    },
    onDelete: 'RESTRICT',
    onUdate: 'NO ACTION'
});

/**
 * Order association with OrderItems 
 */
Order.hasMany(OrderItem,{
    as: 'orderDetails',
});
OrderItem.belongsTo(Order,{
    foreignKey: {
        name:  'orderId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUdate: 'NO ACTION'
});
/**
 * OrderItem association with Item
 */
OrderItem.belongsTo(Item,{
    foreignKey: {
        name:  'itemId',
        allowNull: false
    },
    onDelete: 'NO ACTION',
    onUdate: 'NO ACTION'
});