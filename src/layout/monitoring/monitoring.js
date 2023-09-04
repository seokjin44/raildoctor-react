import { useLocation, useNavigate } from "react-router-dom";
import "./monitoring.css";
import TrackMapImg from "../../assets/picture/faJXt8QKy8mr186zQSroiaIYmWERjuTAk3YzXaw1rWNLPFabugakna_P5Fr3YNAD4yfP0oKB1Yle4RsZHHQwc4SgYoyq_hbnms8-Otm3YP9POJBloQ2bFzXqmZsvc4MQfGBSbNU61XDKkcVsPN0m7g.svg";
import SearchIcon from "../../assets/icon/magnifier.svg";
import DistanceIcon from "../../assets/icon/distance__.svg";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/ko';
import { useEffect, useRef, useState } from "react";
import { Map } from 'react-kakao-maps-sdk';
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import PinIcon from "../../assets/icon/pin_white.png";
import Speed from "../../assets/demo/speed.png";
import InfoIcon from "../../assets/icon/info_white.png";
import TrainIcon from "../../assets/icon/4047310_car_metro_monochrome_monorail_train_icon.png";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import { DatePicker, Input } from 'antd';

import IncheonTrackPDF from "../../assets/pdf/INCHEON_TRACK.pdf";
import IncheonTrackImg from "../../assets/track/incheon_track2.png";
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Box, Modal, Tab } from "@mui/material";

import RailStatus from "../../component/railStatus/railStatus";
import { BOXSTYLE, RAILROADSECTION, RANGEPICKERSTYLE, TRACKSPEEDDATA } from "../../constant";
import classNames from "classnames";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import DataExistence from "../../component/dataExistence/dataExistence";

window.PDFJS = PDFJS;
const { RangePicker } = DatePicker;

function Monitoring( props ) {
  const location = useLocation();
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const [trainImg, setTrainImg] = useState(new Image());
  const [wear3dData, setWear3dData] = useState([]);
  const [railmapOpen, setRailmapOpen] = useState(false);

  const makeDummyWear3dData = () => {
    function randArr(num, mul) {
      const arr = [];
      const index = [];
      for (let i = 0; i < num; i++) {
        arr.push(parseInt(Math.random() * mul))
        index.push(i);
      }
      return arr;
    }

    let data = [
      {
        x: randArr(30, 1300), //
        y: randArr(30, 16200),
        z: randArr(30, 14),
        mode: 'markers',
        type: 'scatter3d',
        name: 'T2 L 0',
        marker: {
          size: 3,
          color: "red"
        },
      },
      {
        x: randArr(300, 1300),
        y: randArr(300, 16200),
        z: randArr(300, 14),
        mode: 'markers',
        type: 'scatter3d',
        name: 'T2 L 45',
        marker: {
          size: 3,
          color: "blue"
        }
      }
    ];

    setWear3dData(data);
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const minimapDrawing = () => {
      const canvas = document.getElementById("minimapCanvas");
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src= IncheonTrackImg;
      img.onload = function() {
        let scale = canvas.width / img.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.save(); // Save the current state of the context
        ctx.translate(0, 0); // Apply translation
        ctx.scale(scale, 0.1); // Apply scaling 
        ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image
        ctx.restore(); // Restore the context to its saved state
        drawRect(position.x, position.y);
      };
  }

  const trainDraw = (ctx, x, y) => {
    ctx.drawImage(trainImg, x-15, y-20, 35, 35); // Draw the image
  }

  const [position, setPosition] = useState({x: 38, y: 5});
  const [dragging, setDragging] = useState(false);
  const [relPos, setRelPos] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const drawRect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(x, y-3, 100, 57);  // Draw rectangle
    ctx.stroke();
    ctx.closePath();
  }

  useEffect(() => {
    //minimapDrawing();
    makeDummyWear3dData();
  }, [position]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= position.x && x <= position.x + 100 && y >= position.y && y <= position.y + 70) {
      setDragging(true);
      setRelPos({x: x - position.x, y: y - position.y});
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      let positionX = e.clientX - rect.left - relPos.x;
      if(positionX < 38){
        positionX = 38;
      }else if( positionX > 1425 ){
        positionX = 1425;
      }
      setPosition({
        x: positionX,
        //y: e.clientY - rect.top - relPos.y
        y: 5
      });
    }
  };

  useEffect(() => {
    /* let minimapContainer = document.getElementById("minimapContainer");
    let canvas = canvasRef.current;
    canvas.width = minimapContainer.clientWidth;
    canvas.height = minimapContainer.clientHeight; */

    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

    //drawRect(position.x, position.y);
    //minimapDrawing(); 
  }, []);

  //const trackDetailCanvasRef = useRef(null);
  const drawCanvas = () => {

    var loadingTask = PDFJS.getDocument(IncheonTrackPDF);
    loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');
    
    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');
        
        var scale = 1;
        var viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('trackDetailCanvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
        canvasContext: context,
        viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
        console.log('Page rendered');
        });
    });
    }, function (reason) {
    // PDF loading error
    console.error(reason);
    });

  }

  const [scale, setScale] = useState(1);
  const [trackDetailPosition, setTrackDetailPosition] = useState({x: 0, y: 0});
  const [trackDetailDragging, setTrackDetailDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [routeHidden, setRouteHidden] = useState(true);
  const [kp, setKP] = useState(0);
  const trackDetailCanvasRef = useRef(null);

  const trackDetailDrawRect = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.save(); // Save the current state of the context
    ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
    ctx.scale(scale, scale); // Apply scaling 
    ctx.fillRect(0, 0, 10, 100); // Draw a rectangle
    ctx.restore(); // Restore the context to its saved state
  }

  const trackDetailDrawImage = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src= IncheonTrackImg;
    img.onload = function() {
      let newWidth = (img.width/img.height) * canvas.height;
      let newHeight = canvas.height;
      console.log(newWidth);
      console.log(img.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
      ctx.scale(1, 1); // Apply scaling 
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight); // Draw the image
      ctx.restore(); // Restore the context to its saved state
    };
  }


  useEffect(() => {
    trackDetailDrawImage();
  }, [trackDetailPosition, scale]);

  const trackDetailHandleMouseDown = (e) => {
    setTrackDetailDragging(true);
    setLastPos({x: e.clientX, y: e.clientY});
  };

  const trackDetailHandleMouseUp = () => {
    setTrackDetailDragging(false);
    setLastPos(null);
  };

  const trackDetailHandleMouseMove = (e) => {
    if (trackDetailDragging) {
      const newPos = {x: e.clientX, y: e.clientY};
      const canvas = trackDetailCanvasRef.current;
      const img = new Image();
      img.src = IncheonTrackImg; // replace with your image url
  
      img.onload = function() {
        const newPosX = trackDetailPosition.x + newPos.x - lastPos.x;
        const newWidth = img.width * scale;
        
        // Check if the new position is outside the canvas
        if (newPosX <= 0 && newPosX + newWidth >= canvas.width) {
          setTrackDetailPosition({
            x: newPosX,
            y: trackDetailPosition.y
          });
        }
        setLastPos(newPos);
      };
    }
  };

  const trackDetailHandleWheel = (e) => {
    e.preventDefault();

    const scaleStep = 0.2;
    let newScale = scale + (e.deltaY < 0 ? scaleStep : -scaleStep);
  
    // Calculate the height of the canvas after scaling
    const newHeight = canvasRef.current.height * newScale;
  
    // Restrict the scale so that the height of the canvas does not exceed a maximum value
    if (newHeight > 500) {
      newScale = 500 / canvasRef.current.height;
    } else {
      // Restrict the scale range: min 0.2x, max 3x
      newScale = Math.max(0.2, Math.min(newScale, 3));
    }
  
    setScale(newScale);
  };
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  useEffect(()=>{
    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

    trackDetailDrawImage();
  },[routeHidden] );

  return (
    <div className="monitoringContainer" >
        <div className="railStatusContainer">
          <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
        </div>
        {/* <div className="searchBar">
          <div className="boxProto minimap searchOption">
            <div className="minimapContainer" id="minimapContainer">
              <canvas id="minimapCanvas"
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
              ></canvas>
            </div>
          </div>
          <div className="boxProto dataSearch searchOption">
            <div className="icon">
              <img src={CalendarIcon} />
            </div>
            <div className="dateText" >
              2022.11.29 ~ 2023.05.06
            </div>
          </div>
        </div> */}

        {/* <div className="guideLine">
          <div className="KP">
            <img src={PinIcon} />15K205
          </div>
        </div> */}
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
              {/* <div className="line"></div> */}
            </div>
          </div>

          <div className={classNames("contentBox wearContainer",{hidden : routeHidden} )} style={{marginLeft : 0}}>
            <div className="containerTitle bothEnds">
              <div>선로열람도</div>
              {/* <div className="dataOption">
                <div className="date">
                  <img src={CalendarIcon} />
                  <RangePicker 
                    style={rangePickerStyle}
                  />
                </div>
              </div> */}
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
              {/* <div className="boxProto minimap searchOption">
                <div className="minimapContainer" id="minimapContainer">
                  <canvas id="minimapCanvas"
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                  ></canvas>
                </div>
              </div> */}
              <div className="boxProto track" id="trackDetailContainer">
                <canvas id="trackDetailCanvas"
                    ref={trackDetailCanvasRef}
                    onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                    onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                    onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                />
              </div>
            </div>
          </div>

          <div className="contentBox" style={{marginLeft : 0, height: "190px"}}>
            <div className="containerTitle bothEnds">
              <div>속도정보</div>
              {/* <div className="dataOption">
                <div className="date">
                  <img src={CalendarIcon} />
                  <RangePicker 
                    style={rangePickerStyle}
                  />
                </div>
              </div> */}
            </div>
            <div className="componentBox separationBox" style={{overflow: "auto"}}>
              <div className="boxProto speed" id="trackDetailContainer">
                {/* <img className="speedDemo" src={Speed} /> */}
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


        <Modal
          open={railmapOpen}
          onClose={(e)=>{setRailmapOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="popupTitle"><img src={PopupIcon} />선로열람도 상세보기</div>
            <div className="railMapContainer">
              <img src={IncheonTrackImg} />
            </div>
          </Box>
        </Modal>      

        {/* <div className="trackDetailBox">
            <div className="search">
              <div className="optionBox w100p">
                <div className="optionTitle">
                    <div className="label"> 거리
                    </div>
                </div>
                <div className="distanceSearch">
                    <input className="local" id="kilometerStart" />
                    <div className="textK">K</div>
                    <input className="local" id="kilometerEnd"/>
                     <div className="divided">~</div>
                    <input className="local" id="kilometerStart" />
                    <div className="textK">K</div>
                    <input className="local" id="kilometerEnd"/>
                </div>
              </div>
              <div className="optionBox w100p">
                <div className="optionTitle">
                    <div className="label">날짜
                    </div>
                </div>
                <div className="dateSearch">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DatePicker label="Start"  />
                    </LocalizationProvider>
                    <div className="divided">~</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DatePicker label="End"  />
                    </LocalizationProvider>
                </div>
              </div>
            </div>
            <div id="minimapContainer" className="minimap">
                <div className="boxTitle">미니맵
                </div>


            </div>
            <div id="trackDetailContainer" className="trackDetail">
              <div className="boxTitle">선로열람도
              </div>

              <canvas id="trackDetailCanvas"
                  ref={trackDetailCanvasRef}
                  onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                  onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                  onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
              />
            </div>
            <div className="trackDataMap">
              <div className="boxTitle">데이터 여부
              </div>
            </div>
        </div> */}
    </div>
  );
}

export default Monitoring;
