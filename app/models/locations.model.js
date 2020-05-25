const { Sequelize, DataTypes, Model } = require('sequelize');

class Location extends Model {
    static init(sequelize) {
        return super.init({
            locationId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            lat: {
                type: DataTypes.DECIMAL(8,6)
            },
            lon: {
                type: DataTypes.DECIMAL(9,6)
            }
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Location' // We need to choose the model name
        });
    }

    static associate(models) {
        // Define association for location belonging to one device
        this.belongsTo(models.Device, {
            foreignKey: {
                name: 'deviceId',
                allowNull: false
            }
        });
    }
        
}

module.exports = {Location}