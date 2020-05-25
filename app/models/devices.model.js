const { Sequelize, DataTypes, Model } = require('sequelize');

class Device extends Model {
    static init(sequelize) {
        return super.init({
            deviceId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING
            },
            lastActive: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Device' // We need to choose the model name
        });
    }

    static associate(models) {
        // Define association for device belonging to one user
        this.belongsTo(models.User, {
            foreignKey: {
                name: 'ownerId',
                allowNull: false
            }
        });
    }
}
module.exports = {Device}