import SimpleMap, {LOCATION_TYPE} from './SimpleMap';

const LATITUDE_THRESHOLD_SECS = 0.4;
const LONGITUDE_THRESHOLD_SECS = 0.4;


export default class SimpleMapHelper {
    
    static getLocations = async(deviceId) => {
        let promise = new Promise( (resolve) => {

            // Call api to get locations for specified device id
            SimpleMapHelper.callApi(`/api/locations/day/${deviceId}`)
            .then(function(response) {
                let data = response.data;
                data.map(location => {
                    location.type = LOCATION_TYPE.DEVICE
                });

                // Group any like locations
                data = SimpleMapHelper.groupLocations(data);
                resolve(data);
            });
        });

        return promise;
    }

    static callApi = async(endpoint, method="get", body=null) => {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: body
        });

        let resBody = await response.json();

        if (response.status !== 200) {
            throw Error(resBody.message);
        }

        return resBody;
    };

    /**
     * Iterates through all locations and groups ones of same device that are in close proximity
     * @param {*} locations 
     * @returns locations array with grouped locations. Entries where lat and lon coordinates are
     * within a close proximity (a few seconds of each other) will be grouped together and only the 
     * latest entry (latest updatedAt time) will be returned
     */
    static groupLocations(locations) {
        // First go through each location grouped by device
        let devices = [];
        let deviceIndexes = {};
        locations.forEach((loc) => {
            // Get the device id and find which index it belongs to in the devices array
            const deviceId = loc.deviceId;
            if (deviceId) { 
                let index = -1;

                if (deviceIndexes.hasOwnProperty(deviceId)) {
                    // We have seen this device id before, so get the index where we are storing these
                    index = deviceIndexes[deviceId];
                } else {
                    // New device found. Create a new element in devices array
                    index = devices.length;
                    deviceIndexes[deviceId] = index;
                    devices.push([]);  // Set an empty array at this location
                }

                // Push a new location for the device
                devices[index].push(loc);
            }
        });

        // Now that we have the locations grouped by device, for each device, sort by date updated
        // and remove any old locations that are close by other newer logged points
        for (let i = 0; i < devices.length; i++) {
            let locs = devices[i];
            // sort in reverse order so most recently updated is at last element
            locs = locs.sort((loc1, loc2) => Date.parse(loc1.updatedAt) - Date.parse(loc2.updatedAt));
            
            // Keep an array of existing locations degrees
            let addedDegrees = [];
            for (let a = locs.length - 1; a >= 0; a--) {
                // Compare current location with existing added entries
                const curDegs = this.decimalLocationToSeconds(locs[a].lat, locs[a].lon);
                if (!this.skipLocationFromThreshold(addedDegrees, curDegs)) {
                    // Location is not within threshold of any other added degrees,
                    // so add it to the array
                    addedDegrees.push(curDegs);
                } else {
                    // This location is within threshold limits of a new added location.
                    // Delete it from the locs array
                    locs.splice(a, 1);
                }
            }
            
            devices[i] = locs;
        }

        // Now go through each devices location and set that to new locations array to return
        let newLocations = [];
        for (const device of devices) {
            for (let i in device) {
                newLocations.unshift(device[i]);
            }
        }

        return newLocations;
    }

    static decimalLocationToSeconds(lat, lon) {
        // Convert lat/lon pair in decimals to seconds (1 degree = 3600 seconds)
        return [lat * 3600, lon * 3600];
    }

    /**
     * Given a list of previously added (valid) degrees (in decimal seconds - each array element is a lat/lon pair
     * representing the decimal value of the location in seconds), checks if both lat/lon entries are 
     * within the specified threshold or not.
     * If they are within the threshold, method returns true. Else returns false
     * @param {*} addedDegrees array of lat/lon pairs in seconds
     * @param {*} degsToCheck lat/lon pair in seconds
     */
    static skipLocationFromThreshold(addedDegrees, degsToCheck) {
        // loop through each addedDegrees
        for (const addedDegPair of addedDegrees) {
            // Check if the lat of degsToCheck is within the threshold of addedDegPair (both index 0)
            if (Math.abs(Math.max(degsToCheck[0], addedDegPair[0]) - Math.min(degsToCheck[0], addedDegPair[0]))  <= LATITUDE_THRESHOLD_SECS && 
                Math.abs(Math.max(degsToCheck[1], addedDegPair[1]) - Math.min(degsToCheck[1], addedDegPair[1])) <= LONGITUDE_THRESHOLD_SECS) 
            {
                return true;
            }
        }

        // degsToCheck was outside threshold from previously added degrees (or the addedDegrees
        // array was empty). So return false as to not skip over this location
        return false;
    }

    static mergeCurrentPositionWithLocations(locations, curPosition) {
        if (!curPosition) {
            return locations;
        }
        // Find the object within location array which holds the current position if exists
        let curLocationFound = false;
        locations.map(location => {
            if (location.type === LOCATION_TYPE.CUR_LOCATION) {
                curLocationFound = true;
                location.lat = curPosition.lat;
                location.lon = curPosition.lon;
            }
        });

        // Current location was not present in current location array, so add a new element
        if (!curLocationFound) {
            // Push a new element with the location
            const location = {
                type: LOCATION_TYPE.CUR_LOCATION,
                lat: curPosition.lat,
                lon: curPosition.lon,
                locationId: -1
            };
            locations.push(location);
        }

        return locations;
    }


}