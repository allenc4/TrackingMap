module.exports = app => {
    const devices = require("../controllers/devices.controller.js");

    var router = require("express").Router();

    // Create a new device
    router.post("/", devices.create);

    // Retrieve all devices
    router.get("/", devices.findAll);

    // Retrieve a device by id
    router.get("/:id", devices.findOne);

    // Get all inactive devices
    router.get("/inactive", devices.findAllInactive);

    // Update a device with id
    router.post("/:id", devices.update);

    // Delete a device with id
    router.delete("/:id", devices.delete);

    // Delete all devices
    router.delete("/", devices.deleteAll);

    // Create  a new device
    router.put("/", devices.create);

    app.use('/api/devices', router);
}