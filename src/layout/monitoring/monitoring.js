import { useLocation } from "react-router-dom";
import "./monitoring.css";
import TrackMapImg from "../../assets/picture/faJXt8QKy8mr186zQSroiaIYmWERjuTAk3YzXaw1rWNLPFabugakna_P5Fr3YNAD4yfP0oKB1Yle4RsZHHQwc4SgYoyq_hbnms8-Otm3YP9POJBloQ2bFzXqmZsvc4MQfGBSbNU61XDKkcVsPN0m7g.svg";
import SearchIcon from "../../assets/icon/magnifier.svg";
import DistanceIcon from "../../assets/icon/distance__.svg";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import { useEffect, useRef, useState } from "react";
import { Map } from 'react-kakao-maps-sdk';
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import PinIcon from "../../assets/icon/pin_white.png";
import Speed from "../../assets/demo/speed.png";
import InfoIcon from "../../assets/icon/info_white.png";
import TrainIcon from "../../assets/icon/4047310_car_metro_monochrome_monorail_train_icon.png";

import IncheonTrackPDF from "../../assets/pdf/INCHEON_TRACK.pdf";
import IncheonTrackImg from "../../assets/track/incheon_track2.png";
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
window.PDFJS = PDFJS;


function Monitoring( props ) {
  const location = useLocation();
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const [trainImg, setTrainImg] = useState(new Image());

  const minimapDrawing = () => {
    
    let canvas = document.getElementById("minimapCanvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let hiehgt = canvas.height;
    let route = [["계양"], ["귤현"], ["박촌"], ["임학"], ["계산"], ["경인교대","입구"], ["작전"],
     ["갈산"], ["부평구청"], ["부평시장"], ["부평"], ["동수"], ["부평","삼거리"], ["간석","오거리"],
     ["인천시청"], ["예술회관"], ["인천","터미널"], ["문학","경기장"], ["선학"], ["신연수"], ["원인재"],
     ["동춘"], ["동막"], ["캠퍼스","타운"], ["테크노","파크"], ["지식정보","단지"], ["인천대","입구"],
     ["센트럴","파크"], ["국제업무","지구"], ["송도달빛","축제공원"]];
    let x = 20;
    for( let routeName of route ){
        let y = hiehgt / 2;
        y -= routeName.length * 15;
        for( let line of routeName ){
            /* ctx.beginPath(); */
            /* ctx.fillStyle = "#000000"; 
            ctx.arc(x, hiehgt / 2 + 10, 10, 0, Math.PI * 2); */
            /* ctx.fill(); */
            ctx.font = "10px Arial";
            ctx.fillText(line, x - (ctx.measureText(line).width/2), y + 10);
            y += 15;
        }
        trainDraw(ctx, x, hiehgt / 2 + 10);
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x, y+14);
        ctx.lineTo(x+50, y+14);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y+11);
        ctx.lineTo(x+50, y+11);
        ctx.stroke();
        x = x + 50;
    }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    //ctx.fillStyle = '#000000';
    ctx.strokeStyle = 'red';
    ctx.rect(x, y, 100, 70);  // Draw rectangle
    ctx.stroke();
  }

  useEffect(() => {
    trainImg.src= TrainIcon;
    console.log(position);
    drawRect(position.x, position.y);
    minimapDrawing();
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
     let minimapContainer = document.getElementById("minimapContainer");
    let canvas = canvasRef.current;
    canvas.width = minimapContainer.clientWidth;
    canvas.height = minimapContainer.clientHeight;

    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

    drawRect(position.x, position.y);
    minimapDrawing(); 
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
  const trackDetailCanvasRef = useRef(null);

  const trackDetailDrawRect = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.save(); // Save the current state of the context
    ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
    ctx.scale(scale, scale); // Apply scaling 
    ctx.fillRect(0, 0, 100, 100); // Draw a rectangle
    ctx.restore(); // Restore the context to its saved state
  }

  const trackDetailDrawImage = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    //img.src = 'https://example.com/image.jpg'; // replace with your image url
    img.src= IncheonTrackImg;
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
      ctx.scale(scale, 0.35); // Apply scaling 
      ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image
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
      const canvas = canvasRef.current;
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

  return (
    <div className="monitoringContainer container">
        {/* <div className="trackBox">
            <div className="boxTitle">
              지도
            </div>
            <div className="track">
                <Map
                  center={{ lat: 33.5563, lng: 126.79581 }}
                  style={{ width: "100%", height: "100%" }}
                >
                </Map>
            </div>
        </div> */}
        <div className="searchBar">
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
              2023.05.05 ~ 2023.05.06
            </div>
          </div>
        </div>

        <div className="trackContent">
          <div className="guideLine">
            <div className="KP">
              <img src={PinIcon} />15K205
            </div>
          </div>
          <div className="boxProto track" id="trackDetailContainer">
            <div className="title">
              <img src={InfoIcon} />
              선로열람도</div>
            <canvas id="trackDetailCanvas"
                ref={trackDetailCanvasRef}
                onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
            />
          </div>
          <div className="boxProto speed" id="trackDetailContainer">
            <div className="title">
              <img src={InfoIcon} />
              속도정보</div>
            <img className="speedDemo" src={Speed} />
          </div>
        </div>
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
