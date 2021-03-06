import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import {LOCATION_TYPE} from './SimpleMap';

import CurrentLocation from  './assets/icons/currentlocation.png';
import Motorcycle50 from './assets/icons/motorcycle50.png';
import MotorcycleActive50 from './assets/icons/motorcycleactive50.png';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${loc => (loc.width? loc.width : '25px')};
  height: ${loc => (loc.width? loc.width : '25px')};
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${loc => (loc.onClick ? 'pointer' : 'default')};
  background-image: ${loc =>loc.backgroundImage};
  &:hover {
    z-index: 1;
  }
`;

const Tooltip = function(props) {
  let name = props.name;
  const type = props.type;
  let timeElement = null;
  if (type === LOCATION_TYPE.CUR_LOCATION) {
    name = "My Location";
  } else {
    let dateStr = new Date(props.time).toLocaleString();
    timeElement = React.createElement("div", null, `${dateStr}`);
  }


  return (
    <div > 
      <div className="title">{name}</div>
      <div className="body">
        {timeElement}
        <a href={`https://maps.google.com/?q=${props.lat},${props.lon}&z=11`} target="_blank" rel="noopener noreferrer">Open in Maps</a>
      </div>
    </div>
  )
}


class Marker extends React.Component {
  constructor(props) {
    super(props);

    let location = props.location;

    if (location.type === LOCATION_TYPE.DEVICE) {
      location.backgroundImage = location.active ? 
              `url(${MotorcycleActive50})` : `url(${Motorcycle50})`;
      location.height = "50px";
      location.width = "50px";
    } else if (location.type === LOCATION_TYPE.CUR_LOCATION) {
      location.backgroundImage = `url(${CurrentLocation})`;
      location.height = "14px";
      location.width = "14px";
    }
    
    this.state = {
      location: location,
      device: props.device,
      id: props.id
    }
  }

  render() {
    const loc = this.state.location;
    const name = this.state.device ? this.state.device.name : '';
    const id = this.state.id;
    
    return (
      <div>
        <Wrapper className= {"marker " + (loc.type == LOCATION_TYPE.CUR_LOCATION ? "shadow-curlocation": "")}
            {...loc}
            {...loc.onClick ? { onClick: loc.onClick} : {}}
            data-for={id}
            data-tip="Unknown"
            data-event="click focus"
        />
        <ReactTooltip id={id} aria-haspopup='true' role='example' place="top" type="light" 
                      effect="solid" className="tooltip" globalEventOff="click">
          <Tooltip type={loc.type} name={name} lat={loc.lat} lon={loc.lon} time={loc.createdAt} />
        </ReactTooltip>
      </div>
    )
  }

}

export default Marker;