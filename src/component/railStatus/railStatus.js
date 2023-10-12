import React from "react";
import "./railSTatus.css";
import isEqual from 'lodash/isEqual';

class RailStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Math.random().toString(36).substring(2, 11),
      padding: 10,
      pointerWidth: 10,
      selectedPath: undefined,
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
      this.dataExist();
    }
	}

  pathClick(select) {
    this.setState({
      selectedPath: select
    });
    this.props.pathClick(select);
  }

  init() {
    if(this.props.railroadSection === undefined)  return;
    document.getElementById("pointer-list-" + this.state.id).innerHTML = "";

    let width = document.getElementById("pointer-list-" + this.state.id).offsetWidth - this.state.padding * 2;
    let tick = width / (this.props.railroadSection.length + 2);

    for (let i = 0; i < this.props.railroadSection.length; i++) {
      let pointerDiv = document.createElement("div");
      pointerDiv.className = "pointer";
      pointerDiv.style.left = (tick * (i + 1)) + "px";
      pointerDiv.style.top = "3px";
      pointerDiv.style.zIndex = 10;
      pointerDiv.style.width = this.state.pointerWidth + "px";

      let pointerTextDiv = document.createElement("div");
      pointerTextDiv.className = "pointerText";
      pointerTextDiv.innerText = this.props.railroadSection[i].start_station_name;
      pointerDiv.appendChild(pointerTextDiv);
      document.getElementById("pointer-list-" + this.state.id).appendChild(pointerDiv);

      if(i === this.props.railroadSection.length - 1) {
        pointerDiv = document.createElement("div");
        pointerDiv.className = "pointer";
        pointerDiv.style.left = (tick * (i + 2)) + "px";
        pointerDiv.style.top = "3px";
        pointerDiv.style.zIndex = 10;
        pointerDiv.style.width = this.state.pointerWidth + "px";

        pointerTextDiv = document.createElement("div");
        pointerTextDiv.className = "pointerText";
        pointerTextDiv.innerText = this.props.railroadSection[i].end_station_name;
        pointerDiv.appendChild(pointerTextDiv);
        document.getElementById("pointer-list-" + this.state.id).appendChild(pointerDiv);
      }

      let pathDiv = document.createElement("div");
      pathDiv.className = "path";
      pathDiv.style.left = (tick * (i + 1) + (this.state.pointerWidth / 2)) + "px";
      pathDiv.style.width = tick + "px";
      pathDiv.style.zIndex = 9;
      pathDiv.style.top = "3px";
      pathDiv.dataset.start_station_id = this.props.railroadSection[i].start_station_id;
      pathDiv.dataset.end_station_id = this.props.railroadSection[i].end_station_id;
      pathDiv.dataset.start_station_name = this.props.railroadSection[i].start_station_name;
      pathDiv.dataset.end_station_name = this.props.railroadSection[i].end_station_name;
      pathDiv.dataset.section_id = this.props.railroadSection[i].id;

      pathDiv.dataset.start_station_up_track_location = this.props.railroadSection[i].start_station_up_track_location;
      pathDiv.dataset.start_station_down_track_location = this.props.railroadSection[i].start_station_down_track_location;
      pathDiv.dataset.end_station_up_track_location = this.props.railroadSection[i].end_station_up_track_location;
      pathDiv.dataset.end_station_down_track_location = this.props.railroadSection[i].end_station_down_track_location;

      pathDiv.dataset.start_station_latitude = this.props.railroadSection[i].start_station_latitude;
      pathDiv.dataset.start_station_longitude = this.props.railroadSection[i].start_station_longitude;
      pathDiv.dataset.end_station_latitude = this.props.railroadSection[i].end_station_latitude;
      pathDiv.dataset.end_station_longitude = this.props.railroadSection[i].end_station_longitude;


      let this_ = this;
      pathDiv.onclick = function (e) {
        let selectedPath = document.getElementsByClassName("path selectedPath")[0];

        if (e.target === selectedPath) {
          return;
        } else if (selectedPath !== undefined) {
          selectedPath.classList.remove("selectedPath");
        }
        e.target.classList.add("selectedPath");

        let path = {
          start_station_id: e.target.dataset.start_station_id,
          end_station_id: e.target.dataset.end_station_id,
          start_station_name: e.target.dataset.start_station_name,
          end_station_name: e.target.dataset.end_station_name,
          section_id: e.target.dataset.section_id,

          start_station_up_track_location: parseInt(e.target.dataset.start_station_up_track_location),
          start_station_down_track_location: parseInt(e.target.dataset.start_station_down_track_location),
          end_station_up_track_location: parseInt(e.target.dataset.end_station_up_track_location),
          end_station_down_track_location: parseInt(e.target.dataset.end_station_down_track_location),

          start_station_latitude: parseFloat(e.target.dataset.start_station_latitude),
          start_station_longitude: parseFloat(e.target.dataset.start_station_longitude),
          end_station_latitude: parseFloat(e.target.dataset.end_station_latitude),
          end_station_longitude: parseFloat(e.target.dataset.end_station_longitude)
        }

        this_.pathClick(path);
      }
      document.getElementById("pointer-list-" + this.state.id).appendChild(pathDiv);
    }
  }

  dataExist() {
    let pathList = document.querySelectorAll(".pointerList .path");
    pathList.forEach( (path, i) => {
      let cnt = this.props.dataExits[i];
      if( cnt > 0 ){
        console.log(path.classList);
        path.classList.add("exist");
        let cntDiv = document.createElement("div");
        cntDiv.innerHTML = "(" + cnt + ")";
        path.appendChild(cntDiv);
      }
    })
  }

  componentDidMount() {
    this.init();
  }

  render() {
    return (
      <div className="railStatusBox">
        <div className="obj rail"></div>
        <div className="obj pointerList" id={"pointer-list-" + this.state.id}>
        </div>
      </div>
    );
  }

}

export default RailStatus;