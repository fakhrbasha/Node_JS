import { Sequelize } from "sequelize"

export const sequelize = new Sequelize('secialmedia', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})


export const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const SyncConnection = async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('SYNC has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}