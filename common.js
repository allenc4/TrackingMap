function Common(){}

/**
 * Validates that the props object has all of the keys specified in 
 * neededOptions. Returns all of the neededOptions keys not found in props
 * 
 * @param props - properties to check (can be request.params, request.body, etc)
 * @param neededOptions - array of all needed properties 
 * @param response - Response object. If set and missing options in props,
 *                   Sends a 400 error response message with missing properties
 * @returns
 */
Common.prototype.validate = function(props, neededOptions, response) {

    var missingProps = [];
    for (var obj of neededOptions) {
        if (!props.hasOwnProperty(obj)) {
            missingProps.push(obj);
        }
    }

    if (response && missingProps.length > 0) {
        response.status(400).send({
            message: `Missing required attributes: ${missingProps}`
        });
    }

    return missingProps;
}

Common.prototype.sendJson = function(response, status, data, msg) {
    let obj = {};
    if (msg) {
        obj.message = msg;
    } else if (status >= 200 && status < 300) {
        obj.message = "Success";
    }

    if (data) {
        obj.data = data;
    }

    response.status(status).send(obj);
}

module.exports = new Common();