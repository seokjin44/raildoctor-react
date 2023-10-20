import "./monitoring.css";
import 'dayjs/locale/ko';
import { useEffect, useRef, useState } from "react";
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import { DatePicker, Input } from 'antd';
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import RailStatus from "../../component/railStatus/railStatus";
import { BOXSTYLE, RAILROADSECTION, RANGEPICKERSTYLE, TRACKSPEEDDATA } from "../../constant";
import classNames from "classnames";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import DataExistence from "../../component/dataExistence/dataExistence";
import TrackMap from "../../component/trackMap/trackMap";
import axios from 'axios';
import qs from 'qs';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";

window.PDFJS = PDFJS;
const { RangePicker } = DatePicker;

let pictureList = [];
function Monitoring( props ) {
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  /* const [routeHidden, setRouteHidden] = useState(true); */
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [routeHidden, setRouteHidden] = useState(false);
  const [kp, setKP] = useState(0);
  const [railmapOpen, setRailmapOpen] = useState(false);
  const [viewRailMap, setViewRailMap] = useState(null);
  const [kpMarker, setKPMarker] = useState(0);

  const [accumulateWeights, setAccumulateWeights] = useState([]);
  const [railbehaviors, setRailbehaviors] = useState([]);
  const [railtwists, setRailtwists] = useState([]);
  const [railwears, setRailwears] = useState([]);
  const [temperatures, setTemperatures] = useState([]);

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

  const findPictureAndPosition = (km) => {
    for (let pic of pictureList) {
        if (pic.beginKp <= km && km <= pic.endKp) {
            const position = ((km - pic.beginKp) / (pic.endKp - pic.beginKp)) * pic.width;
            return { url: `https://raildoctor.suredatalab.kr${pic.fileName}`, originalWidth: pic.width, position: Math.round(position) };
        }
    }
    return null;
  }

  const adjustPosition = () => {
    if (imgRef.current) {
        const scaleFactor = imgRef.current.clientWidth / viewRailMap.originalWidth;
        const adjustedPosition = viewRailMap.position * scaleFactor;
        setKPMarker(adjustedPosition);
        containerRef.current.scrollLeft = adjustedPosition - (containerRef.current.offsetWidth / 2);
    }
}


  useEffect( ()=>{
    axios.get(`https://raildoctor.suredatalab.kr/api/railroads/railroadmap`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : "인천 1호선"
      }
    })
    .then(response => {
      console.log(response.data);
      /* "https://raildoctor.suredatalab.kr/resources/data/railroads/railroadmap/c1e7c0a1-e425-4793-9e91-933f003b1cb9.jpeg" */
      pictureList = response.data.entities;
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [] )

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
                    onChange={(e)=>{
                        console.log(e);
                        axios.get(`https://raildoctor.suredatalab.kr/api/statistics/data`,{
                          paramsSerializer: params => {
                            return qs.stringify(params, { format: 'RFC3986' })
                          },
                          params : {
                            railroad : "인천 1호선",
                            /* beginTs : e[0].$d.toISOString(),
                            endTs : e[1].$d.toISOString(),
                            beginKp : 0.23,
                            endKp : 16.84 */
                          }
                        })
                        .then(response => {
                          console.log(response.data);
                          setAccumulateWeights(response.data.accumulateWeights);
                          setRailbehaviors(response.data.railbehaviors);
                          setRailtwists(response.data.railtwists);
                          setRailwears(response.data.railwears);
                          setTemperatures(response.data.temperatures);
                        })
                        .catch(error => console.error('Error fetching data:', error));
                    }}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP" onKeyDown={(e)=>{if(e.key==="Enter"){
                    setKP(e.target.value);
                    let find = findPictureAndPosition( parseInt(e.target.value) / 1000);
                    setViewRailMap(find);
                    adjustPosition();
                    /* setKPMarker(find.position); */

                    /* markerElement.style.left = `${result.position}px`;
                    container.scrollLeft = result.position - (container.offsetWidth / 2); */ // km 위치가 컨테이너의 중앙에 오도록 스크롤 조정
                  }}}
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
              <div ref={containerRef} className="boxProto track">
                {/* <canvas id="trackDetailCanvas"
                    ref={trackDetailCanvasRef}
                    onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                    onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                    onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                /> */}
                {/* <TrackMap 
                  open={railmapOpen} 
                  popupClose={()=>{setRailmapOpen(false)}}
                  kp={kp} 
                /> */}
                {
                  (viewRailMap) ?
                    <img ref={imgRef} src={viewRailMap.url} onLoad={()=>{
                      adjustPosition();
                      /* setKPMarker(viewRailMap.position); */
                      /* markerElement.style.left = `${result.position}px`;
                      container.scrollLeft = result.position - (container.offsetWidth / 2); */ // km 위치가 컨테이너의 중앙에 오도록 스크롤 조정
                    }} /> : null
                }
                <div className="kpMarker" style={{left:`${kpMarker}px`}}></div>
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
              <DataExistence 
                kp={kp}
                accumulateWeights={accumulateWeights}
                railbehaviors={railbehaviors}
                railtwists={railtwists}
                railwears={railwears}
                temperatures={temperatures}
              ></DataExistence>
            </div>
          </div>
        </div>

        <Modal
        open={railmapOpen}
        onClose={(e)=>{console.log(e);setRailmapOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          borderRadius: "5px",
          //p: 4,
          padding : "5px",
          fontFamily : 'NEO_R',
          height: '90vh',
          overflow: 'auto'
        }} >
            {(viewRailMap) ? <img src={viewRailMap.url} /> : null}
        </Box>
      </Modal> 
    </div>
  );
}

export default Monitoring;
