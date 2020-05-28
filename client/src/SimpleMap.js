import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import AuthConfig from './auth';

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
            locations: []
        };
    }

    // Return map bounds based on list of locations
    static getMapBounds = (map, maps, locations) => {
        const bounds = new maps.LatLngBounds();

        locations.forEach((location) => {
            bounds.extend(new maps.LatLng(
                location.lat,
                location.lon
            ));
        });

        return bounds;
    };

    // Re-center map when resizing the window
    static bindResizeListener = (map, maps, bounds) => {
        maps.event.addDomListenerOnce(map, 'idle', () => {
            maps.event.addDomListener(window, 'resize', () => {
                map.fitBounds(bounds);
            });
        });
    };

    // Fit map to its bounds after the google maps api is loaded
    static apiIsLoaded = (map, maps, locations) => {
        // Get bounds by our locations
        const bounds = this.getMapBounds(map, maps, locations);
        // Fit map to bounds
        map.fitBounds(bounds);
        // Bind the resize listener
        this.bindResizeListener(map, maps, bounds);
    };

    // On watched geolocation position, function gets triggered on position change
    geolocationChanged(position) {
        console.log("Position changed");

        // Find the object within location array which holds the current position if exists
        let locations = this.state.locations;
        let curLocationFound = false;
        locations.map(location => {
            if (location.type === LOCATION_TYPE.CUR_LOCATION) {
                curLocationFound = true;
                location.lat = position.coords.latitude;
                location.lon = position.coords.longitude;
            }
        });

        // Current location was not present in current location array, so add a new element
        if (!curLocationFound) {
            // Push a new element with the location
            const location = {
                type: LOCATION_TYPE.CUR_LOCATION,
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            locations.push(location);
        }

        this.setState({ locations: locations });

    }

    geolocationError(err) {
        console.log(err);
    }

    componentDidMount() {
        const reactState = this;
        console.log("Component mounted");
        this.callApi('/api/locations/day/ChrisGpyMTrack001')
            .then(function(response) {
                let data = response.data;
                data.map(location => {
                    location.type = LOCATION_TYPE.DEVICE
                });

                // Set an event handler to watch current user position
                navigator.geolocation.watchPosition(reactState.geolocationChanged, reactState.geolocationError);

                return data;
            })
            .then(data => {this.setState({locations: data})})
            .catch(err => console.log(err));

    }

    callApi = async(endpoint, method="get", body=null) => {
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


    render() {
        let {locations} = this.state;

        var bIsFirstDevice = true;
        locations.map(location => {
            if (location.type == LOCATION_TYPE.DEVICE) {
                location.backgroundImage = bIsFirstDevice ? 
                        "url(icons/motorcycle-active-50.png)" : "url(icons/motorcycle-50.png)";
                location.active = bIsFirstDevice ? true : false;
                location.height = "50px";
                location.width = "50px";
                bIsFirstDevice = false;
            } else if (location.type == LOCATION_TYPE.CUR_LOCATION) {
                location.backgroundImage="url(icons/current-location.png)"
                location.active = false;
                location.height = "14px";
                location.width = "14px";
            }
        });

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    // bootstrapURLKeys={{ key: AuthConfig.GOOGLE_MAP_API_KEY }}
                    defaultCenter={ this.state.center }
                    defaultZoom={ this.state.zoom }
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={ ({ map, maps }) => SimpleMap.apiIsLoaded(map, maps, locations) }
                    >

                    {
                        locations.map(location => (
                            <Marker 
                                key={"location" + location.locationId}
                                text={location.createdAt}
                                lat={location.lat}
                                lng={location.lon}
                                width={location.width}
                                height={location.height}
                                backgroundImage={location.backgroundImage}
                                active={location.active}
                            />
                        ))
                    }
                    

                </GoogleMapReact>
            </div>
        );
    }
}

export default SimpleMap;