module.exports = app => {
    const users = require("../controllers/users.controller.js");

    var router = require("express").Router();

    // Create a new User
    router.put("/", users.create);

    // Update a user with id
    router.post("/:id", users.update);

    // Delete a user with id
    router.delete("/:id", users.delete);

    app.use('/api/users', router);
}