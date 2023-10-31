import React from "react";
import "./railSTatus.css";
import isEqual from 'lodash/isEqual';
import { STRING_PATH, STRING_STATION } from "../../constant";

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
    console.log("!");
    if(this.props.railroadSection === undefined)  return;
    document.getElementById("pointer-list-" + this.state.id).innerHTML = "";

    let width = document.getElementById("pointer-list-" + this.state.id).offsetWidth - this.state.padding * 2;
    /* let tick = width / (this.props.railroadSection.length + 2); */
    let stationList = [];
    let pathList = [];
    for(let section of this.props.railroadSection){
      if( section.type === STRING_STATION ){
        stationList.push(section);
      }
    }
    for(let section of this.props.railroadSection){
      if( section.type === STRING_PATH ){
        pathList.push(section);
      }
    }

    let tick = width / (stationList.length + 1);
    for (let i = 0; i < stationList.length; i++) {
        let section = stationList[i];
        let pointerDiv = document.createElement("div");
        pointerDiv.className = `pointer obj i${section.index}`;
        pointerDiv.style.left = (tick * (i + 1)) + "px";
        pointerDiv.style.top = "3px";
        pointerDiv.style.zIndex = 10;
        pointerDiv.style.width = this.state.pointerWidth + "px";
  
        pointerDiv.dataset.start_station_name = section.displayName;
        pointerDiv.dataset.end_station_name = section.displayName;
        pointerDiv.dataset.beginKp = section.beginKp;
        pointerDiv.dataset.endKp = section.endKp;
        let this_ = this;
        pointerDiv.onclick = function (e) {
          console.log(e);
          let selectedPointer = document.getElementsByClassName("pointer selectedPath")[0];
          if (e.target === selectedPointer) {
            return;
          } else if (selectedPointer !== undefined) {
            selectedPointer.classList.remove("selectedPath");
          }

          let selectedPath = document.getElementsByClassName("path selectedPath")[0];
          if (e.target === selectedPath) {
            return;
          } else if (selectedPath !== undefined) {
            selectedPath.classList.remove("selectedPath");
          }

          e.target.classList.add("selectedPath");
  
          let path = {
            start_station_name: e.target.dataset.start_station_name,
            end_station_name: e.target.dataset.end_station_name,
            type : STRING_STATION,
            beginKp: Math.floor(e.target.dataset.beginKp * 1000),
            endKp: Math.floor(e.target.dataset.endKp * 1000),
          }
  
          this_.pathClick(path);
        }

        let pointerTextDiv = document.createElement("div");
        pointerTextDiv.className = "pointerText";
        pointerTextDiv.innerText = section.displayName;
        
        pointerDiv.appendChild(pointerTextDiv);
        document.getElementById("pointer-list-" + this.state.id).appendChild(pointerDiv);
    }

    /* tick = width / (pathList.length + 2); */
    for (let i = 0; i < pathList.length; i++) {
      let section = pathList[i];
        /* let section = this.props.railroadSection[i];
        let pointerDiv = document.createElement("div");
        pointerDiv.className = "pointer";
        pointerDiv.style.left = (tick * (i + 1)) + "px";
        pointerDiv.style.top = "3px";
        pointerDiv.style.zIndex = 10;
        pointerDiv.style.width = this.state.pointerWidth + "px";
  
        let pointerTextDiv = document.createElement("div");
        pointerTextDiv.className = "pointerText";
        pointerTextDiv.innerText = section.displayName;
        pointerDiv.appendChild(pointerTextDiv);
        document.getElementById("pointer-list-" + this.state.id).appendChild(pointerDiv); */

      /* if(i < this.props.railroadSection.length - 1) { */
        let pathDiv = document.createElement("div");
        pathDiv.className = `path obj i${section.index}`;
        pathDiv.style.left = (tick * (i + 1) + (this.state.pointerWidth / 2)) + "px";
        pathDiv.style.width = tick + "px";
        pathDiv.style.zIndex = 9;
        pathDiv.style.top = "3px";

        pathDiv.dataset.start_station_name = section.start_station_name;
        pathDiv.dataset.end_station_name = section.end_station_name;
  
        pathDiv.dataset.beginKp = section.beginKp;
        pathDiv.dataset.endKp = section.endKp;

        let this_ = this;
        pathDiv.onclick = function (e) {
          let selectedPath = document.getElementsByClassName("path selectedPath")[0];
          if (e.target === selectedPath) {
            return;
          } else if (selectedPath !== undefined) {
            selectedPath.classList.remove("selectedPath");
          }

          let selectedPointer = document.getElementsByClassName("pointer selectedPath")[0];
          if (e.target === selectedPointer) {
            return;
          } else if (selectedPointer !== undefined) {
            selectedPointer.classList.remove("selectedPath");
          }

          e.target.classList.add("selectedPath");
  
          let path = {
            start_station_name: e.target.dataset.start_station_name,
            end_station_name: e.target.dataset.end_station_name,
            type : STRING_PATH,
            beginKp: Math.floor(e.target.dataset.beginKp * 1000),
            endKp: Math.floor(e.target.dataset.endKp * 1000),
          }
  
          this_.pathClick(path);
        }
        document.getElementById("pointer-list-" + this.state.id).appendChild(pathDiv);
      /* } */      
    }
  }

  dataExist() {
    this.props.dataExits.forEach( (cnt, i) => {
      if( cnt > 0 ){
        let obj = document.querySelectorAll(`.pointerList .obj.i${i}`)[0];
        console.log(obj.classList);
        obj.classList.add("exist");
        let cntDiv = document.createElement("div");
        cntDiv.className = "cnt"
        /* cntDiv.innerHTML = "(" + cnt + ")"; */
        obj.appendChild(cntDiv);
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