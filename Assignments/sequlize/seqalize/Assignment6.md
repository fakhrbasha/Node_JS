# Assignment 6 `ORM`

## Sequelize

### part one

#### users

```jsx
import { DataTypes } from 'sequelize';
import { sequelize } from '../connectionDB.js';
const userModel = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'u_id',
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
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
            throw new Error('Password must be longer than 6 characters');
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        if (!user.Name || user.Name.length <= 2) {
          throw new Error('Name Must be greater than 2 characters');
        }
      },
    },
  },
);

export default userModel;
```

- create table name user and sequelize add `s` by default
- make validation on email when add email if email exist has error because it unique
- make validation in password create function to check len of password
- create hook `beforeCreate` to check user length

#### posts

```jsx
import { DataTypes } from 'sequelize';
import { sequelize } from '../connectionDB.js';

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
  },
);

export default postModel;
```

- first make forging key for user model named `userId` recreance users table and key name `u_id`
- make `paranoid` to allow soft delete mean when delete create column name deleted at and make it delete to db but still in db

#### Comments

```jsx
import { DataTypes } from 'sequelize';
import { sequelize } from '../connectionDB.js';

const commentModel = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'c_id',
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'p_id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'u_id',
    },
  },
});

export default commentModel;
```

- make two foreign key ...

**_Now Go TO ASSOCIATION_**

```jsx
import userModel from './user.model.js';
import postModel from './post.model.js';
import commentModel from './comment.model.js';

userModel.hasMany(postModel, { foreignKey: 'userId' });
postModel.belongsTo(userModel, { foreignKey: 'userId' });

postModel.hasMany(commentModel, { foreignKey: 'postId' });
commentModel.belongsTo(postModel, { foreignKey: 'postId' });

userModel.hasMany(commentModel, { foreignKey: 'userId' });
commentModel.belongsTo(userModel, { foreignKey: 'userId' });

export { userModel, postModel, commentModel };
```

- Create associations to define foreign keys between models

### Part Two

##### user

- folder structure of postman
  <!-- ![folderStructure](image-1.png) -->
  ![folder](./images/image-19.png)

1.  ![validation Error](./images/image-2.png)
    ![name](./images/image-3.png)
    ![email](./images/image-4.png)
    ![add](./images/image-5.png)

2.  ![update](./images/image-6.png)
    ![notFound](./images/image-7.png)
    ![skip](./images/image-8.png)

3.  ![email](./images/image-9.png)
    ![not](./images/image-10.png)

4.  ![getById](./images/image-11.png)
    ![alt text](./images/image-12.png)

##### post

1. ![mentor](./images/image-13.png)

2. ![delete!](./images/image-14.png)
   ![delete](./images/image-15.png)
   ![not](./images/image-16.png)

3. ![details](./images/image-17.png)

4. ![count](./images/image-18.png)

##### Comments

1.  ![bulk](./images/image-21.png)

2.  ![alter](./images/image-22.png)
    ![up](./images/image-23.png)
    ![not](./images/image-24.png)

3.  ![already](./images/image-25.png)
    ![fakhr](./images/image-26.png)

4.  ![search](./images/image-27.png)
    ![img](./images/image-28.png)

5.  ![3](./images/image-29.png)

6.  ![last](./images/image-30.png)
