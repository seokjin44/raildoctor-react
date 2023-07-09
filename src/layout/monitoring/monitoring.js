import { useLocation } from "react-router-dom";
import "./monitoring.css";
import TrackMapImg from "../../assets/picture/faJXt8QKy8mr186zQSroiaIYmWERjuTAk3YzXaw1rWNLPFabugakna_P5Fr3YNAD4yfP0oKB1Yle4RsZHHQwc4SgYoyq_hbnms8-Otm3YP9POJBloQ2bFzXqmZsvc4MQfGBSbNU61XDKkcVsPN0m7g.svg";
import SearchIcon from "../../assets/icon/magnifier.svg";
import DistanceIcon from "../../assets/icon/distance__.svg";
import CalendarIcon from "../../assets/icon/calendar.svg";
import PinIcon from "../../assets/icon/353397_circle_map_marker_pin_icon.svg";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import { useEffect, useRef, useState } from "react";

import IncheonTrackPDF from "../../assets/pdf/INCHEON_TRACK.pdf";
import IncheonTrackImg from "../../assets/track/incheon_track.png";
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
window.PDFJS = PDFJS;


function Monitoring( props ) {
  const location = useLocation();
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;


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
    let x = 50;
    for( let routeName of route ){
        let y = hiehgt / 2;
        y -= routeName.length * 15;
        for( let line of routeName ){
            ctx.beginPath();
            ctx.fillStyle = "#000000"; 
            ctx.arc(x, hiehgt / 2, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = "12px Arial";
            ctx.fillText(line, x - (ctx.measureText(line).width/2), y);
            y += 15;
        }
        x = x + 50;
    }
  }

  const [position, setPosition] = useState({x: 38, y: 44});
  const [dragging, setDragging] = useState(false);
  const [relPos, setRelPos] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const drawRect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    //ctx.fillStyle = '#000000';
    ctx.strokeStyle = 'red';
    ctx.rect(x, y, 100, 100);  // Draw rectangle
    ctx.stroke();
  }

  useEffect(() => {
    console.log(position);
    drawRect(position.x, position.y);
    minimapDrawing();
  }, [position]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= position.x && x <= position.x + 100 && y >= position.y && y <= position.y + 100) {
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
        y: 44
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
    //drawCanvas();
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
      ctx.scale(scale, scale); // Apply scaling 
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
/*     if (trackDetailDragging) {
      const newPos = {x: e.clientX, y: e.clientY};
      setTrackDetailPosition({
        x: trackDetailPosition.x + newPos.x - lastPos.x,
        y: trackDetailPosition.y // keep the y position constant
      });
      setLastPos(newPos);
    } */

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
    <div className="monitoringContainer">
        <div className="trackBox">
            <div className="track">
                <img src={TrackMapImg} />
            </div>
        </div>
        <div className="trackDetailBox">
            <div className="search">
              <div className="optionBox">
                <div className="optionTitle">
                    <div className="label">
                        {/* <div className="icon">
                            <img src={DistanceIcon} />
                        </div> */} 거리
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
              <div className="optionBox">
                <div className="optionTitle">
                    <div className="label">
                        {/* <div className="icon">
                                <img style={{width:'79%'}} src={CalendarIcon} />
                        </div> */} 날짜
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
                {/* <div className="searchBtn">
                    <img src={SearchIcon}/>
                </div> */}
            </div>
            <div id="minimapContainer" className="minimap">
                <div className="boxTitle">
                    {/* <div className="icon">
                        <img src={PinIcon} />
                    </div> */}미니맵
                </div>

                <canvas id="minimapCanvas"
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                ></canvas>
            </div>
            <div id="trackDetailContainer" className="trackDetail">
              <div className="boxTitle">
                  {/* <div className="icon">
                      <img src={PinIcon} />
                  </div> */}선로열람도
              </div>

              <canvas id="trackDetailCanvas"
                  ref={trackDetailCanvasRef}
                  onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                  onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                  onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                  //onWheel={trackDetailHandleWheel}
              />
            </div>
            <div className="trackDataMap">
              <div className="boxTitle">
                  {/* <div className="icon">
                      <img src={PinIcon} />
                  </div> */}데이터 여부
              </div>
            </div>
        </div>
    </div>
  );
}

export default Monitoring;
