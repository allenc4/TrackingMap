const db = require("../models");
const User = db.Models.User;
const common = require("../../common");

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (common.validate(req.body, ["name"], res).length > 0) {
        // If any missing attributes, return
        return;
    }

    // Create a User
    const user = {
        name: req.body.name
    };

    // Save User in the database
    User.create(user)
    .then(data => {
        common.sendJson(res, 200, data);
    })
    .catch(err => {
        common.sendJson(res, 500, null, err.message || "Error occurred while creating the User");
    });
};


// Delete User by id
exports.delete = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const userId = req.params.id;

    User.destroy({
        where: { userId: userId }
    })
    .then(num => {
        if (num == 1) {
            common.sendJson(res, 200, null, "User was successfully deleted");
        } else {
            common.sendJson(res, 500, null, `User of id ${userId} not found`);
        }
       
    })
    .catch(err => {
        common.sendJson(res, 500, null, "Error deleting user");
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (common.validate(req.params, ["id"], res).length > 0) {
        // If any missing attributes, return
        return;
    }
    const userId = req.params.id;

    User.update(req.body, {
        where: { userId: userId }
    })
    .then(num => {
        if (num == 1) {
            common.sendJson(res, 200, null, "Updated successfully");
        } else {
            common.sendJson(res, 500, null, `Failed to update user with id=${id}`);
        }
    })
    .catch(err => {
        common.sendJson(res, 500, null, "Error updating user with id " + deviceId);
    });
};