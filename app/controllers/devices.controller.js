const db = require("../models");
const Device = db.Models.Device;
const Op = db.Sequelize.Op;
const common = require("../../common");

// Create and Save a new Device
exports.create = (req, res) => {
    // Validate request has name parameter
    if (common.validate(req.body, ["id", "name", "owner"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    // Create a Device
    const device = {
        name: req.body.name,
        deviceId: req.body.id,
        ownerId: req.body.owner
    };

    // Save Device in the database
    Device.create(device)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Device"
        });
    });
};

// Retrieve all Devices from the database.
exports.findAll = (req, res) => {
    // Validate request has name parameter
    if (common.validate(req.params, ["name"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const name = req.params.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Device.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error occurred while querying for Devices"
            });
        });
};

// Find a single Device with an id
exports.findOne = (req, res) => {
    // Validate request has name parameter
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const deviceId = req.params.id;

    Device.findByPk(deviceId)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message: "Error while finding device by id=" + deviceId
          });
      });

};

// Update a Device by the id in the request
exports.update = (req, res) => {
    // Validate request has name parameter
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const deviceId = req.params.id;

    Device.update(req.body, {
        where: { deviceId: deviceId }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Updated successfully"
            });
        } else {
            res.send({
                message: `Failed to update device with id=${id}`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating device with id " + deviceId
        });
    });
};

// Delete a Device with the specified id in the request
exports.delete = (req, res) => {
    // Validate request has name parameter
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const deviceId = req.params.id;

    Device.destroy({
        where: { deviceId: deviceId }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Device deleted successfully"
            });
        } else {
            res.send({
                message: `Failed to upddeleteate device with id=${id}`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error deleting device with id " + deviceId
        });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Devices.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} devices were deleted` })
    })
    .catch( err => {
        res.status(500).send({
            message: 
                err.message || "Exception occurred deleting devices"
        });
    });
};

// Find all Devices which were not active in the past two days
exports.findAllInactive = (req, res) => {
    var condition = { lastActive: { [Op.lte]: moment().subtract(2, 'days').toDate() } };

    Device.findAll({ where: condition })
    .then(data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({
            message:
            err.message || "Exception occurred querying inactive devices"
        });
    });
};