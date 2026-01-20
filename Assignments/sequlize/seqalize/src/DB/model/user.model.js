import { DataTypes } from "sequelize";
import { sequelize } from "../connectionDB.js";
const userModel = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "u_id",
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     checkLen(value) {
            //         if (value.length <= 2) {
            //             throw new Error("Name Must be greater than 2 character");

            //         }
            //     }
            // }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                checkPasswordLength(value) {
                    if (value.length <= 6) {
                        throw new Error("Password must be longer than 6 characters");
                    }
                },
            },
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },
    },
    {
        timestamps: true,
        hooks: {
            beforeCreate: (user) => {
                if (!user.Name || user.Name.length <= 2) {
                    throw new Error("Name Must be greater than 2 characters");
                }
            }
        }
    }
);

export default userModel
