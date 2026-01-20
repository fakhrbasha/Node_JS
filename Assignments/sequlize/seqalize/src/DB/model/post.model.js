import { DataTypes } from "sequelize";
import { sequelize } from "../connectionDB.js";

const postModel = sequelize.define(
    'post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'p_id',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'u_id',
            },
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

export default postModel;
