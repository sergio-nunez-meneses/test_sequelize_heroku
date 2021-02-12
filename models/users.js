'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    async generateJwt(jti) {
      try {
        const token = await jwt.sign({
          jti: jti,
          id: this.id,
          role: this.role
        },
        privateKey,
        {
          algorithm: 'RS256',
          expiresIn: 240
        });

        return token;
      } catch (err) {
        return err;
      }
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
