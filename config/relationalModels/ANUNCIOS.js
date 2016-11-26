/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ANUNCIOS', {
    ID_ANUNCIOS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    NOMBRE: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DESCRIPCION: {
      type: DataTypes.STRING,
      allowNull: true
    },
    FECHA_INICIO: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FECHA_FIN: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LINK: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ESTADO: {
      type: DataTypes.CHAR,
      allowNull: true
    }
  }, {
        tableName: 'ANUNCIOS',
        freezeTableName: true, // Model tableName will be the same as the model name
        updatedAt : false,
        createdAt: false
  });
};
