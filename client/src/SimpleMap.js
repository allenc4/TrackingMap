import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import AuthConfig from './auth';

import SimpleMapHelper from './SimpleMapHelper';

const LOCATION_TYPE = {
    CUR_LOCATION: "CUR_LOCATION",
    DEVICE: "DEVICE"
};

class SimpleMap extends React.Component {
    static defaultProps = {
        home: {
            lat: 42.420441,
            lng: -71.058403
        },
        zoom: 11
    };

    constructor(props) {
        super(props);
        let center = SimpleMap.defaultProps.home;
        if (props.hasOwnProperty('center')) {
            center = props.center;
        }

        // bind functions
        this.geolocationChanged = this.geolocationChanged.bind(this);
        this.geolocationError = this.geolocationError.bind(this);

        this.state = {
            center: center,
            zoom: SimpleMap.defaultProps.zoom,
            curLocation: null,
            userId: props.userId,
            deviceInfo: [],
            containerHeight: props.containerHeight,
            gMap: null,
            gMaps: null,
            bounds: null
        };
    }

    // Re-center map when resizing the window
    bindResizeListener = (gMap, gMaps) => {
        gMaps.event.addDomListenerOnce(gMap, 'idle', () => {
            gMaps.event.addDomListener(window, 'resize', () => {
                gMap.fitBounds(this.state.bounds);
            });
        });
    };

    // Return map bounds based on list of locations
    getMapBounds = (locations) => {
        const gMaps = this.state.gMaps;
        const bounds = new gMaps.LatLngBounds();

        locations.forEach((location) => {
            bounds.extend(new gMaps.LatLng(
                location.lat,
                location.lon
            ));
        });

        return bounds;
    };

    // Fit map to its bounds after the google maps api is loaded
    apiIsLoaded = (map, maps) => {
        // Bind the resize listener
        this.bindResizeListener(map, maps);

        // Save google map and maps params to state
        this.setState({
            gMap: map,
            gMaps: maps
        });
    };


    // On watched geolocation position, function gets triggered on position change
    geolocationChanged(position) {
        console.log("Position changed");
        let location = this.state.curLocation
        // Find the object within location array which holds the current position if exists
        if (this.state.curLocation != null) {
            location.lat = position.coords.latitude;
            location.lon = position.coords.longitude;
        } else {
            // Current location was not present in current location array, so add a new element
            // Push a new element with the location
            location = {
                type: LOCATION_TYPE.CUR_LOCATION,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                locationId: -1
            };
        }

        this.setState({ curLocation: location });
    }

    geolocationError(err) {
        console.error("Exception occurred in geolocation callback");
        console.error(err);
    }

    componentDidMount() {
        const reactState = this;
        console.log("Component mounted");
        let state = this.state;

        // Set the container height (either from props or screenheight)
        let nHeight = this.state.containerHeight;
        if (!nHeight|| nHeight == 0) {
            // Get the offset of the element
            nHeight = window.innerHeight - this.refs.container.getBoundingClientRect().top;
            const parentPadding = window.getComputedStyle(this.refs.container.parentElement).getPropertyValue('padding-bottom');
            if (parentPadding) {
                nHeight -= parseInt(parentPadding);
            }
            nHeight = nHeight < 200 ? 200 : nHeight;
            state.containerHeight = nHeight;
        }

        // Set an event handler to watch current user position
        navigator.geolocation.watchPosition(reactState.geolocationChanged, reactState.geolocationError);

        // Get current position immediately
        navigator.geolocation.getCurrentPosition(reactState.geolocationChanged, reactState.geolocationError);
    }

    /**
     * Implement componentDidUpdate method to check if specific properties were updated.
     * If so, handles different events based on that
     * @param {*} prevProps 
     */
    componentDidUpdate(prevProps) {
        const newLocs = this.props.locations;
        let gMaps = this.state.gMaps;
        let gMap = this.state.gMap;
        let curState = this.state;
        let stateUpdated = false;

        if (prevProps.locations !== newLocs) {
            // Need to retrieve the new bounds and refit the bounds in the map
            // Get bounds by our locations
            const bounds = this.getMapBounds(newLocs);
            // Fit map to bounds and update bounds within state (so resize listener is updated)
            gMap.fitBounds(bounds);
            curState.bounds = bounds;
            stateUpdated = true;
        }

        if (stateUpdated) {
            this.setState(curState);
        }
    }

    render() {
        const {deviceInfo} = this.state;
        const containerHeight = this.state.containerHeight + 'px';
        let locations = this.props.locations;
        
        // Push current location to locations array
        locations = SimpleMapHelper.mergeCurrentPositionWithLocations(locations, this.state.curLocation);

        var bIsFirstDevice = true;
        locations.map(location => {
            if (location.type == LOCATION_TYPE.DEVICE) {
                location.active = bIsFirstDevice ? true : false;
                bIsFirstDevice = false;
            } else if (location.type == LOCATION_TYPE.CUR_LOCATION) {
                location.active = false;
            }
        });

        const renderMarker = (location, key) => {

            console.log("marker render");
            console.log(location);
            // Find the device which owns this location
            const device = deviceInfo.find(device => device.deviceId === location.deviceId);

            return <Marker 
                key={"location" + location.locationId + "-" + key}
                id={"location" + location.locationId}
                location={location}
                lat={location.lat}
                lng={location.lon}
                device = {device}
            />
        }

        return (
            // Important! Always set the container height explicitly
            <div style={{height: containerHeight, width: '100%'}} ref='container'>
                <GoogleMapReact
                    // bootstrapURLKeys={{ key: AuthConfig.GOOGLE_MAP_API_KEY }}
                    defaultCenter={ this.state.center }
                    defaultZoom={ this.state.zoom }
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={ ({ map, maps }) => this.apiIsLoaded(map, maps) }
                    >

                    {
                        locations.map((location, index) => (
                            renderMarker(location, index)
                        ))
                    }

                </GoogleMapReact>
            </div>
        );
    }
}

export {LOCATION_TYPE};
export default SimpleMap;