import "./monitoring.css";
import 'dayjs/locale/ko';
import { useState } from "react";
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import { DatePicker, Input } from 'antd';
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import RailStatus from "../../component/railStatus/railStatus";
import { RAILROADSECTION, RANGEPICKERSTYLE, TRACKSPEEDDATA } from "../../constant";
import classNames from "classnames";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import DataExistence from "../../component/dataExistence/dataExistence";
import TrackMap from "../../component/trackMap/trackMap";

window.PDFJS = PDFJS;
const { RangePicker } = DatePicker;

function Monitoring( props ) {
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  /* const [routeHidden, setRouteHidden] = useState(true); */
  const [routeHidden, setRouteHidden] = useState(false);
  const [kp, setKP] = useState(0);
  const [railmapOpen, setRailmapOpen] = useState(false);

  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    //setSelectedPath(select);
  }

  /* useEffect(()=>{
    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

    trackDetailDrawImage();
  },[routeHidden] ); */

  return (
    <div className="monitoringContainer" >
        <div className="railStatusContainer">
          <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
        </div>
        <div className="monitoringContent" style={{ height: "calc(100% - 135px)", width: "100%", overflow: "auto"}} >
          <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">탐색날짜 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP" onKeyDown={(e)=>{if(e.key==="Enter"){setKP(e.target.value)}}}
                    style={RANGEPICKERSTYLE} defaultValue={kp}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div>
            </div>
          </div>

          <div className={classNames("contentBox wearContainer",{hidden : routeHidden} )} style={{marginLeft : 0}}>
            <div className="containerTitle bothEnds">
              <div>선로열람도</div>
              <div className="flex">
                <div className="modalButton" style={{cursor:"pointer"}}>
                  <div className="value" onClick={()=>{ 
                    setRouteHidden(!routeHidden);
                  }}>
                    {(!routeHidden) ? "숨기기" : "펼치기"}
                  </div>
                </div>
                <div className="modalButton highlight" onClick={()=>{
                          console.log("선로열람도 상세보기");
                          setRailmapOpen(true);
                }} >선로열람도 상세보기</div>
              </div>
            </div>
            <div className={classNames("componentBox separationBox",{hidden : routeHidden} )} style={{overflow: "auto"}}>
              <div className="boxProto track">
                {/* <canvas id="trackDetailCanvas"
                    ref={trackDetailCanvasRef}
                    onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                    onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                    onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                /> */}
                <TrackMap 
                  open={railmapOpen} 
                  popupClose={()=>{setRailmapOpen(false)}}
                  kp={kp} 
                />
              </div>
            </div>
          </div>

          <div className="contentBox" style={{marginLeft : 0, height: "190px"}}>
            <div className="containerTitle bothEnds">
              <div>속도정보</div>
            </div>
            <div className="componentBox separationBox">
              <div className="boxProto speed">
                <TrackSpeed data={TRACKSPEEDDATA} kp={kp} ></TrackSpeed>
              </div>
            </div>
          </div>

          <div className="contentBox" style={{marginLeft : 0}}>
            <div className="containerTitle bothEnds">
              <div>데이터여부</div>
              <div className="dataOption">
                <div className="date">
                  <img src={CalendarIcon} />
                  2022.01.01 ~ 2023.05.05
                </div>
              </div>
            </div>
            <div className="componentBox separationBox">
              <DataExistence kp={kp}></DataExistence>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Monitoring;
