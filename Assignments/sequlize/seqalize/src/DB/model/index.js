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
