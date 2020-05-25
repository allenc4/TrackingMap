const db = require("../models");
const Location = db.Models.Location;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const common = require("../../common");
const moment = require("moment");

// Create and Save a new Location
exports.create = (req, res) => {
    // Validate request
    if (common.validate(req.body, ["deviceId", "lat", "lon"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    // Create a Location
    const location = {
        deviceUid: req.body.deviceId,
        lat: req.body.lat,
        lon: req.body.lon,
        logDate: moment()
    };

    // Save Location in the database
    Location.create(location)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Location"
        });
    });
};

// Retrieve all Locations from the database for a particular device.
exports.findByDeviceId = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    const deviceUid = req.params.id;
    var condition = deviceUid ? { deviceUid: { [Op.like]: `%${deviceUid}%` } } : null;

    Location.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error occurred while querying for Locations"
            });
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
            deviceUid: deviceId
        },
        order: [Sequelize.col('createdAt'), 'DESC'],
        limit: 1
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error while finding device by id=" + deviceId
        });
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
        res.send({
            message: `${num} locations were deleted`
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error deleting locations of device id " + deviceId
        });
    });
};

// Delete all Locations from the database.
exports.deleteAll = (req, res) => {
    Devices.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} locations were deleted` })
    })
    .catch( err => {
        res.status(500).send({
            message: 
                err.message || "Exception occurred deleting locations"
        });
    });
};