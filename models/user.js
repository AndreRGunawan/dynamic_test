'use strict';
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class User extends Model {}
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email already exists.'
        },
        validate: {
          notNull: {
            args: true,
            msg: 'Email is required field'
          },
          isEmail: {
            args: true,
            msg: 'Invalid email format'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Password is required field'
          },
          len: {
            args: [6],
            msg: 'Password at least have 6 characters'
          }
        }
      }
    },
    {
      sequelize,
      beforeCreate(user, opt) {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
