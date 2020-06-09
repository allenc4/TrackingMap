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
        common.sendJson(res, 200, data);
    })
    .catch(err => {
        common.sendJson(res, 500, null, err.message || "Some error occurred while creating the Device");
    });
};

// Retrieve all Devices from the database.
exports.findAll = (req, res) => {
    // Validate request has name parameter
    const name = req.params.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Device.findAll({ where: condition})
        .then(data => {
            common.sendJson(res, 200, data);
        })
        .catch(err => {
            common.sendJson(res, 500, null, err.message || "Error occurred while querying for Devices");
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
          common.sendJson(res, 200, data);
      })
      .catch(err => {
          common.sendJson(res, 500, null, "Error while finding device by id=" + deviceId);
      });

};

// Retrieve all Devices of a user
exports.findByUser = (req, res) => {
    // Validate request has name parameter
    const userId = req.params.userId;
    if (common.validate(req.params, ["userId"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    Device.findAll({ 
            where: {
                ownerId: userId
            }
        })
        .then(data => {
            common.sendJson(res, 200, data);
        })
        .catch(err => {
            common.sendJson(res, 500, null, err.message || "Error occurred while querying for Devices");
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
            common.sendJson(res, 200, null, "Updated successfully");
        } else {
            common.sendJson(res, 500, null, `Failed to update device with id=${id}`);
        }
    })
    .catch(err => {
        common.sendJson(res, 500, null, `Failed to update device with id=${id}`);
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
            common.sendJson(res, 200, null, "Device deleted successfully");
        } else {
            common.sendJson(res, 500, null, `Failed to upddeleteate device with id=${id}`);
        }
    })
    .catch(err => {
        common.sendJson(res, 500, null, "Error deleting device with id " + deviceId);
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Devices.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        common.sendJson(res, 200, null, `${nums} devices were deleted`);
    })
    .catch( err => {
        common.sendJson(res, 500, null, err.message || "Exception occurred deleting devices");
    });
};

// Find all Devices which were not active in the past two days
exports.findAllInactive = (req, res) => {
    var condition = { lastActive: { [Op.lte]: moment().subtract(2, 'days').toDate() } };

    Device.findAll({ where: condition })
    .then(data => {
        common.sendJson(res, 200, data);
    })
    .catch( err => {
        common.sendJson(res, 500, null, "Exception occurred querying inactive devices");
    });
};