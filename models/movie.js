"use strict";

module.exports = function(sequelize, DataTypes) {
  var movie = sequelize.define("movie", {
    imdb_code: DataTypes.STRING,
    title: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.movie.hasMany(models.comment);
      }
    }
  });

  return movie;
};
