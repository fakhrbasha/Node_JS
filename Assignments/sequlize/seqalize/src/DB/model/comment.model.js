import { DataTypes } from "sequelize";
import { sequelize } from "../connectionDB.js";




const commentModel = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'c_id'
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,

    }
    ,
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'p_id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'u_id'
        }
    }


})

export default commentModel