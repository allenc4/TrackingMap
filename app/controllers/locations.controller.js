const db = require("../models");
const Location = db.Models.Location;
const Sequelize = db.Sequelize;
const op = Sequelize.Op;
const common = require("../../common");
const moment = require("moment");

const opAlias = {
    $gte: op.gte,
    $like: op.like
}

// Create and Save a new Location
exports.create = (req, res) => {
    // Validate request
    if (common.validate(req.body, ["deviceId", "lat", "lon"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    // Create a Location
    const location = {
        deviceId: req.body.deviceId,
        lat: req.body.lat,
        lon: req.body.lon,
        logDate: moment()
    };

    // Save Location in the database
    Location.create(location)
    .then(data => {
        common.sendJson(res, 200, data);
    })
    .catch(err => {
        common.sendJson(res, 500, null, msg= (err.message || "Error occurred while creating the Location"));
    });
};

// Retrieve all Locations from the database for a particular device.
exports.findByDeviceId = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    const deviceId = req.params.id;
    var condition = deviceId ? { deviceId: { [opAlias.$like]: `%${deviceId}%` } } : null;

    Location.findAll({ where: condition})
        .then(data => {
            common.sendJson(res, 200, data);
        })
        .catch(err => {
            common.sendJson(res, 500, null, err.message || "Error occurred while querying for Locations");
        });
};

// Find the last location of a device id
exports.findLatest = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const deviceId = req.params.id;
    
    Device.findAll({ 
        where: {
            deviceId: deviceId
        },
        order: [Sequelize.col('createdAt'), 'DESC'],
        limit: 1
    })
    .then(data => {
        common.sendJson(res, 200, data);
    })
    .catch(err => {
        common.sendJson(res, 500, null, "Error while finding device by id=");
    });

};

// Retrieve all Locations for the past day given a particular device
exports.findPastDay = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    const deviceId = req.params.id;
    var condition = deviceId ? { deviceId: { [opAlias.$like]: `%${deviceId}%` } } : null;

    Location.findAll({ 
        where: {
            deviceId: deviceId,
            createdAt: {
                [opAlias.$gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .then(data => {
        common.sendJson(res, 200, data);
    })
    .catch(err => {
        common.sendJson(res, 500, null, err.message || "Error occurred while querying for Locations");
    });
};
// Delete all locations of device id
exports.deleteAllByDeviceId = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const deviceId = req.params.id;

    Device.destroy({
        where: { deviceId: deviceId }
    })
    .then(num => {
        common.sendJson(res, 200, null, `${num} locations were deleted`);
    })
    .catch(err => {
        common.sendJson(res, 500, null, "Error deleting locations of device id " + deviceId);
    });
};

// Delete all Locations from the database.
exports.deleteAll = (req, res) => {
    Devices.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        common.sendJson(res, 200, null, `${nums} locations were deleted`);
    })
    .catch( err => {
        common.sendJson(res, 500, null, err.message || "Exception occurred deleting locations");
    });
};