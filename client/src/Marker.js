import React from 'react';
import styled from 'styled-components';


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
      <Wrapper
          alt={props.text}
          {...props}
          {...props.onClick ? { onClick: props.onClick} : {}}
      />
    )
  }

}

export default Marker;