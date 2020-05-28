module.exports = app => {
    const locations = require("../controllers/locations.controller");

    var router = require("express").Router();

    // Create a new location
    router.put("/", locations.create);

    // Retrieve latest location by device id
    router.get("/:id", locations.findLatest);
    
    // Retrieve all locations by device id
    router.get("/all/:id", locations.findByDeviceId);

    // Retrieve last day of locations by device id
    router.get("/day/:id", locations.findPastDay);

    // Delete all locations of device
    router.delete("/:id", locations.deleteAllByDeviceId);

    // Delete all locations of every device
    router.delete("/", locations.deleteAll);

    app.use('/api/locations', router);
}