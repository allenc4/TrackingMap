import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import LOCATION_TYPE from './SimpleMap';



const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => (props.width? props.width : '25px')};
  height: ${props => (props.width? props.width : '25px')};
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
  background-image: ${props => props.backgroundImage};
`;

const Tooltip = function(props) {
  const type = props.type;
  const name = props.name;
  if (type === LOCATION_TYPE.CUR_LOCATION) {
    name = "My Location";
  }

  return (
    <div className="tooltip" > 
      <p className="title">{name}</p>
      <ul>
        <li>{props.time}</li>
        <li>{ `{${props.lat}, ${props.lon}`}</li>
      </ul>
    </div>
  )
}


class Marker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      props: props
    }
  }

  render() {
    const text = this.state.text;
    const props = this.state.props;
    
    return (
      <div>
        <Wrapper className="marker"
            alt={props.text}
            {...props}
            {...props.onClick ? { onClick: props.onClick} : {}}
            data-for={"markerTooltip" + props.locationId}
            data-tip="Unknown"
        />
        <ReactTooltip id={"markerTooltip" + props.locationId} aria-haspopup='true' role='example' place="top" type="light" effect="solid">
          <Tooltip type={props.type} name={props.name} lat={props.lat} lon={props.lng} time={props.time} />
        </ReactTooltip>
      </div>
    )
  }

}

export default Marker;