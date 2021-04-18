import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import HistoryIcon from '@material-ui/icons/History';
import ExploreIcon from '@material-ui/icons/Explore';
import { withStyles} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import SimpleMap from './SimpleMap';
import SimpleMapHelper from './SimpleMapHelper';

const drawerWidth = 350;

const useStyles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    height: '100%'
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  },
});

class PersistentSideDrawer extends React.Component {
    constructor(props) {
        super(props);

        // Bind handlers
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleDeviceCheckToggle = this.handleDeviceCheckToggle.bind(this);
        
        this.state = {
            title: "Location Trackr",
            open: false,
            userId: 1,  // TODO change to authenticated user
            userDevices: [],
            selectedDevices: [],
            locations: []
        };
    }

    handleDrawerOpen = function() {
        this.setState({open: true});
    }

    handleDrawerClose = function() {
        this.setState({open: false});
    }

    handleDeviceCheckToggle = async(deviceId) => {
        const currentIndex = this.state.selectedDevices.indexOf(deviceId);
        const newSelectedDevices = [...this.state.selectedDevices];
        let locations = [...this.state.locations];

        if (currentIndex < 0) {
            newSelectedDevices.push(deviceId);
            // Call api to get all locations for this device
            try {
                const newLocs = await SimpleMapHelper.getLocations(deviceId);
                console.log("New locs: " + newLocs);
                if (newLocs && newLocs.length > 0) {
                    Array.prototype.push.apply(locations, newLocs);
                }
            } catch(err) {
                console.err(err);
            }
        } else {
            newSelectedDevices.splice(currentIndex, 1);
            // Remove any locations referencing this device
            for (let i = locations.length - 1; i >= 0; i--) {
                if (locations[i].deviceId === deviceId) {
                    locations.splice(i,1);
                }
            }
        }

        this.setState({
            selectedDevices: newSelectedDevices,
            locations: locations
        });
    }

    componentDidMount() {
        // After mounting component, need to populate the left nav with user devices
        // First, get all device info for the current user
        SimpleMapHelper.callApi('/api/devices/ownedby/' + this.state.userId)
            .then(resp => this.setState({userDevices: resp.data}))
            .catch(err => {
                console.error("Exception in API call");
                console.error(err);
            });
    }

    render() {
        const isOpen = this.state.open;
        const title = this.state.title;
        const userId = this.state.userId;
        const {classes} = this.props;

        // Build the list items for each device
        let deviceItems = [];
        this.state.userDevices.forEach(device => {
            const labelId = `checkbox-list-secondary-label-${device.deviceId}`
            deviceItems.push(
                <ListItem button key={device.deviceId} id={"nav_device_" + device.deviceId}>
                    {/* TODO add device type to database and change icon based on that */}
                    <ListItemIcon><MotorcycleIcon/></ListItemIcon>
                    <ListItemText id={labelId} primary={device.name} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            onChange={() => {this.handleDeviceCheckToggle(device.deviceId)}}
                            checked={this.state.selectedDevices.indexOf(device.deviceId) !== -1}
                            inputProps={{ 'aria-labelledby': labelId}}
                        />
                    </ListItemSecondaryAction>
                </ListItem>

            );
        });

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar ref='appbar'
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: isOpen,
                    })}
                >
                    <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, isOpen && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>{title}</Typography>
                    </Toolbar>
                </AppBar>


                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={isOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                    </div>
                    <Divider />
                    {/* First add the devices */}
                    <List>{deviceItems}</List>
                    <Divider />
                    {/* Add entry to view list of locations from selected devices */}
                    <List>
                        <ListItem button>
                            <ListItemIcon> <ExploreIcon /></ListItemIcon>
                            <ListItemText primary="Map" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon> <HistoryIcon /> </ListItemIcon>
                            <ListItemText primary="History" />
                        </ListItem>
                    </List>
                    {/* TODO add settings or something here  */}
                    {/* <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List> */}
                </Drawer>
                <main
                    className={clsx(classes.content, {
                    [classes.contentShift]: isOpen,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    
                    <SimpleMap userId={userId} 
                            locations={this.state.locations}/>

                </main>
            </div>
        );
    }

}

export default withStyles(useStyles)(PersistentSideDrawer);