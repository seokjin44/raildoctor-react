import React from "react";
import "./railSTatus.css";
import isEqual from 'lodash/isEqual';
import { STRING_PATH, STRING_STATION } from "../../constant";
import classNames from "classnames";
import { getTrackColor } from "../../util";

let route = sessionStorage.getItem('route');
class RailStatus extends React.Component {

  constructor(props) {
    super(props);
    this.railContainer = React.createRef();
    this.state = {
      id: Math.random().toString(36).substring(2, 11),
      padding: 10,
      /* pointerWidth: 10, */
      selectedPath: undefined,
      railObj : [],
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.props.railroadSection === undefined)  return;
    if(this.props.railroadSection.length === 0)  return;
    
    if(prevProps.railroadSection === undefined ||
      this.props.railroadSection.length !== prevProps.railroadSection.length ||
      JSON.stringify(prevProps.railroadSection) !== JSON.stringify(this.props.railroadSection)) {
      this.init();
    }

    if (!isEqual(prevProps.dataExits, this.props.dataExits)) {
      console.log("props array has changed!");
      console.log(this.props.dataExits);
    }

    if (!isEqual(prevProps.resizeOn, this.props.resizeOn)) {
      console.log("props array has changed!");
      this.init();
    }
	}

  pathClick(select) {
    this.setState({
      selectedPath: select
    });
    this.props.pathClick(select);
  }

  init() {
    console.log("!");
    if(this.props.railroadSection === undefined)  return;
    let pointerWidth = 10;
    let railObj_ = [];
    let width = this.railContainer.current.offsetWidth - this.state.padding * 2;
    let stationList = [];
    let pathList = [];
    for(let index in this.props.railroadSection ){
      let section = this.props.railroadSection[index];
      if( section.type === STRING_STATION ){
        stationList.push({...section, ...{ index : index }});
      }
      if( section.type === STRING_PATH ){
        pathList.push({...section, ...{ index : index }});
      }
    }

    let tick = width / (stationList.length + 1);
    for (let i = 0; i < stationList.length; i++) {
        let section = stationList[i];
        let pointerDiv = document.createElement("div");
        pointerDiv.className = `pointer obj i${section.index}`;

        railObj_.push({
          left : (tick * (i + 1)),
          width : pointerWidth,
          start_station_name : section.displayName,
          end_station_name : section.displayName,
          beginKp : section.beginKp * 1000,
          endKp : section.endKp * 1000,
          type : STRING_STATION,
          index : section.index
        })
    }

    for (let i = 0; i < pathList.length; i++) {
      let section = pathList[i];
        let pathDiv = document.createElement("div");
        pathDiv.className = `path obj i${section.index}`;

        railObj_.push({
          left : (tick * (i + 1) + (pointerWidth / 2)),
          width : tick,
          start_station_name : section.start_station_name,
          end_station_name : section.end_station_name,
          beginKp : section.beginKp * 1000,
          endKp : section.endKp * 1000,
          type : STRING_PATH,
          index : section.index
        })
    }

    this.setState({
      railObj : railObj_
    })
  }

  componentDidMount() {
    this.init();
  }

  render() {
    return (
      <div className="railStatusBox">
        <div className={`obj rail`} style={{background : getTrackColor(route)}}></div>
        <div className="obj pointerList" ref={this.railContainer} >
          {
            this.state.railObj.map( (obj, i) => {
              let className = "";
              let zIndex = 0;
              let text = null;
              let exist = false;
              if( this.props.dataExits ){
                exist = (this.props.dataExits[obj.index] > 0);
              }
              if( obj.type === STRING_PATH ){
                 className="path"; zIndex = 9;
              };
              if( obj.type === STRING_STATION ){
                 className="pointer"; zIndex = 10;
                 text = <div className="pointerText">{obj.start_station_name}</div>;
              };
              return <div key={i} className={
                  classNames(`obj ${className}`, 
                    {selectedPath : this.state.selectedPath?.index === obj.index },
                    {exist : exist }
                  )
                }
                style={{ left : obj.left, width : `${obj.width}px`, zIndex : zIndex }}
                onClick={(e)=>{this.pathClick(obj)}}
              >{text}</div>
            })
          }
        </div>
      </div>
    );
  }

}

export default RailStatus;