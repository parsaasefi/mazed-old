module.exports = (sequelize, DataTypes) => {
  const blacklist = sequelize.define('blacklist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    host: DataTypes.STRING,
  });

  return blacklist;
};
