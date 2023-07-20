import { useLocation, useNavigate } from "react-router-dom";
import "./wearMaintenance.css";
import PlaceInfo from "../../component/PlaceInfo/PlaceInfo";
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useRef, useState } from "react";
import { Radio, Slider, DatePicker, Space, TimePicker, Input } from "antd";
import ModalCustom from "../../component/Modal/Modal";
import WearInfo from "../../component/WearInfo/WearInfo";
import LinearInfo from "../../component/LinearInfo/LinearInfo";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import Speed from "../../assets/demo/speed.png";
import IncheonTrackImg from "../../assets/track/incheon_track2.png";
import MuiRadio from '@mui/joy/Radio';
//import RadioGroup from '@mui/joy/RadioGroup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import RailIcon from "../../assets/icon/1342923_citycons_public_rail_train_transport_icon.png";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import { Select } from 'antd';
import classNames from "classnames";
import { Box, Modal } from "@mui/material";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import { DIRECTWEARINFO, INSTRUMENTATIONPOINT, RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE, SIDEWEARINFO } from "../../constant";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";

const { TextArea } = Input;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: "5px",
  //p: 4,
  padding : "5px",
  fontFamily : 'NEO_R'
};


const linearInfo = [{
  x: 10,
  y: 50,
  name: "1",
  type: "line"
}, {
  x: 20,
  y: 100,
  name: "2",
  type: "line"
}, {
  x: 30,
  y: 100,
  name: "3",
  type: "dash"
}, {
  x: 35,
  y: 80,
  name: "4",
  type: "line"
}, {
  x: 40,
  y: 80,
  name: "5",
  type: "line"
}, {
  x: 50,
  y: 60,
  name: "6",
  type: "line"
}, {
  x: 60,
  y: 60,
  name: "7",
  type: "line"
}, {
  x: 70,
  y: 0,
  name: "8",
  type: "line"
}, {
  x: 75,
  y: 0,
  name: "9",
  type: "dash"
}, {
  x: 80,
  y: 60,
  name: "10",
  type: "line"
}, {
  x: 85,
  y: 60,
  name: "11",
  type: "line"
}, {
  x: 95,
  y: 80,
  name: "12",
  type: "line"
}, {
  x: 100,
  y: 80,
  name: "13",
  type: "line"
}];

const trackSpeed = [
  {
    trackType: -1,
    data: [{
      x: 0,
      y: 40,
      name: "14b687"
    }, {
      x: 10,
      y: 40,
      name: "14b687"
    }, {
      x: 30,
      y: 40,
      name: "14b687"
    }, {
      x: 40,
      y: 0,
      name: "14b687"
    }, {
      x: 50,
      y: 40,
      name: "14b687"
    }, {
      x: 60,
      y: 40,
      name: "14b687"
    }, {
      x: 70,
      y: 50,
      name: "14b687"
    }, {
      x: 75,
      y: 50,
      name: "14b687"
    }, {
      x: 80,
      y: 42,
      name: "14b687"
    }, {
      x: 85,
      y: 42,
      name: "14b687"
    }, {
      x: 95,
      y: 0,
      name: "14b687"
    }, {
      x: 100,
      y: 30,
      name: "14b687"
    }]
  },
  {
    trackType: 1,
    data: [{
      x: 20,
      y: 25,
      name: "14b687"
    }, {
      x: 40,
      y: 75,
      name: "14b687"
    }, {
      x: 60,
      y: 75,
      name: "14b687"
    }, {
      x: 80,
      y: 45,
      name: "14b687"
    }, {
      x: 100,
      y: 65,
      name: "14b687"
    }, {
      x: 120,
      y: 40,
      name: "14b687"
    }, {
      x: 140,
      y: 35,
      name: "14b687"
    }]
  }
];

const getInstrumentationPoint = (select) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("railroad_id", "0");
  urlencoded.append("start_station_up_track_location", select.start_station_up_track_location);
  urlencoded.append("end_station_up_track_location", select.end_station_up_track_location);
  urlencoded.append("start_station_down_track_location", select.start_station_down_track_location);
  urlencoded.append("end_station_down_track_location", select.end_station_down_track_location);

  var requestOptions = {
    method: 'POST',
    //redirect: 'follow',
    headers: myHeaders,
    body: urlencoded
  };

  fetch("/RailDoctor/railroad/getInstrumentationPoint", requestOptions)
    .then(response => {
      return response.json(); //Promise 반환
    }).then(result => {
      console.log(result)
      this.setState({
        //selectedPath: select,
        instrumentationPoint: result
      });
    }).catch(error => {
      console.log('error', error)
    });
}



  function WearMaintenance( props ) {
  const location = useLocation();
  //const [instrumentationPoint, setInstrumentationPoint] = useState([]);
  const [selectedPath, setSelectedPath] = useState({
    "start_station_id": "15",
    "end_station_id": "16",
    "start_station_name": "간석오거리",
    "end_station_name": "인천시청",
    "section_id": "16",
    "start_station_up_track_location": 14000,
    "start_station_down_track_location": 14000,
    "end_station_up_track_location": 15400,
    "end_station_down_track_location": 15400,
    "start_station_latitude": 37.4669093,
    "start_station_longitude": 126.7079019,
    "end_station_latitude": 37.4576187,
    "end_station_longitude": 126.7022161
});
  const [wearSearchCondition, setWearSearchCondition] = useState({
    startDate: new Date().getTime() - (31536000000 * 7),
    endDate: new Date().getTime(),
    startMGT: 0,
    endMGT: 3000
  });
  const [wear3dData, setWear3dData] = useState([]);
  const [wearData, setWearData] = useState({
    directWearInfo: [],
    sideWearInfo: [],
  });
  const trackDetailCanvasRef = useRef(null);
  const canvasRef = useRef(null);

  const [trackDetailPosition, setTrackDetailPosition] = useState({x: 0, y: 0});
  const [scale, setScale] = useState(1);
  const [menuSelect, setMenuSelect] = useState(1);
  const trackDetailDrawImage = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src= IncheonTrackImg;
    img.onload = function() {
      let scaleFactor = canvas.height / img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
      //ctx.scale(0.65, 0.22); // Apply scaling 
      ctx.scale(0.65, scaleFactor);
      ctx.drawImage(img, -8000, 0, img.width, img.height); // Draw the image
      ctx.restore(); // Restore the context to its saved state
    };
  }
  const [position, setPosition] = useState({x: 38, y: 5});
  const [dragging, setDragging] = useState(false);
  const [relPos, setRelPos] = useState({x: 0, y: 0});

  const [trackDetailDragging, setTrackDetailDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }
  const handleClose2 = () => {
    setOpen2(false);
  }



  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  
  const timeFormatDate = (milliSeconds) => {
    let d = new Date(milliSeconds); 
    var date1=d.getFullYear()+'/'+((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+'/'+(d.getDate()<10?"0"+d.getDate():d.getDate());
    return date1;
  }

  const timeFormatDate2 = (milliSeconds) => {
    let d = new Date(milliSeconds); 
    var date1=d.getFullYear()+'-'+((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+'-'+(d.getDate()<10?"0"+d.getDate():d.getDate());
    var date2=(d.getHours() < 10 ? "0" + d.getHours() : d.getHours() + 1)+":"+(d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes() + 1)+":"+(d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds() + 1);

    return date1 + " " + date2;
  }

  const onChangeTimeSlider = (newValue) => {
    console.log(timeFormatDate(newValue[0]) + "   ~   " + timeFormatDate(newValue[1]));
    setWearSearchCondition({
        startDate: newValue[0],
        endDate: newValue[1],
        startMGT: parseInt(document.getElementById("startWearMGT").innerText),
        endMGT: parseInt(document.getElementById("endWearMGT").innerText)
      });
    
  };

  const onChangeMgtSlider = (newValue) => {
    console.log(newValue);
    setWearSearchCondition({
        startDate: new Date(document.getElementById("startWearDate").innerText).getTime(),
        endDate: new Date(document.getElementById("endWearDate").innerText).getTime(),
        startMGT: newValue[0],
        endMGT: newValue[1]
      
    });
  };

  const getWearInfo = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("railroad_id", "0");
    urlencoded.append("location", document.getElementById("wearSearchPoint").value);
    urlencoded.append("start_date", document.getElementById("startWearDate").innerText);
    urlencoded.append("end_date", document.getElementById("endWearDate").innerText);
    urlencoded.append("start_mgt", document.getElementById("startWearMGT").innerText);
    urlencoded.append("end_mgt", document.getElementById("endWearMGT").innerText);

    var requestOptions = {
      method: 'POST',
      //redirect: 'follow',
      headers: myHeaders,
      body: urlencoded
    };

    fetch("/RailDoctor/wearInfo/getWearInfo", requestOptions)
      .then(response => {
        return response.json(); //Promise 반환
      }).then(result => {
        console.log(result);
        this.setState({
          wearData: {
            directWearInfo: result.direct_wear,
            sideWearInfo: result.side_wear,
          }
        });
        console.log(this.setState.wearData);
      }).catch(error => {
        console.log('error', error)
      });
  }

  const onClickWearSearch = () => {
    getWearInfo();
  }

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

  const drawRect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(x, y-3, 100, 46);  // Draw rectangle
    ctx.stroke();
    ctx.closePath();
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

    makeDummyWear3dData();
    trackDetailDrawImage();
  }, []);
  
  return (
    <div className="wearMaintenance" >
      {/* <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div> */}

      {/* <div className="graphGroup">
        <div className="contentBox linearContainer mr15">
          <div className="containerTitle tab">
            <div className="tab select">선형정보</div>
            <div className="tab">구배</div>
          </div>
          <div className="componentBox"><LinearInfo data={linearInfo}></LinearInfo></div>
        </div>
        <div className="contentBox speedContainer">
          <div className="containerTitle">통과속도 정보</div>
          <div className="componentBox">
            <img src={Speed} />
          </div>
        </div>
      </div> */}
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
      </div>
      <div className="dataContainer">
        {/* <div className="sideMenu">
          <div className="title"><img src={RailIcon} />마모유지관리</div>
          <div className={classNames( "menu", { "active" : menuSelect === 1 } )} onClick={()=>{setMenuSelect(1)}} >마모정보</div>
          <div className={classNames( "menu", { "active" : menuSelect === 2 } )} onClick={()=>{setMenuSelect(2)}} >마모예측</div>
        </div> */}
        <div className="scrollContainer" style={{ width: "calc(100%)", height: "calc(100% - 0px)", overflow: "auto"}}>
          <div className="graphSection">
            <div className="leftContainer">
              <div className="contentBox linearContainer mr10" style={{marginBottom:"10px", height:"calc(100% - 287px)"}}>
                <div className="containerTitle tab">
                  <div className="tab select">선형정보</div>
                  <div className="tab">구배</div>
                </div>
                <div className="componentBox">
                {/* <div className="boxProto minimap searchOption" style={{height:"50px"}}>
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
              <div className="contentBox speedContainer" style={{height:"272px"}}>
                <div className="containerTitle">통과속도 정보</div>
                <div className="componentBox" style={{ marginRight: "10px", width: "calc(100% - 10px)", overflow: "hidden"}}>
                  <div className="demoImgContainer">
                    <img src={Speed} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rightContainer">
              <div className="contentBox pointContainer">
                <div className="containerTitle">지점정보</div>
                <div className="componentBox"><PlaceInfo path={selectedPath} instrumentationPoint={INSTRUMENTATIONPOINT}></PlaceInfo></div>
              </div>
              <div className="mamoGraphContainer">
                <div className="contentBox searchContainer mr10" style={{width:"35%"}}>
                  <div className="containerTitle">조회 조건</div>
                  <div className="componentBox">
                    <div className="flex flexDirectionColumn margin10" style={{"height": "calc(100% - 20px)", "justify-content": "flex-start"}}>
                      <div className="searchOption selectBox">
                        <div className="title flex textBold">계측 위치</div>
                        <div className="flex">
                            <Input placeholder="KP" value={"14K100"} style={RANGEPICKERSTYLE} />
                        </div>
                      </div>
                      <div className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                        <div className="flex bothEnds valueBox">
                          <label className="textBold title">계측기간</label>
                          <div className="flex dataText">
                            <div id="startWearDate">{timeFormatDate(wearSearchCondition.startDate)}</div>
                            <div>~</div>
                            <div id="endWearDate">{timeFormatDate(wearSearchCondition.endDate)}</div>
                          </div>
                        </div>
                        <div className="flex" tyle={{height:'30px'}}>
                          <div className="sliderContainer">
                            <Slider range={{ draggableTrack: true }} min={new Date().getTime() - (31536000000 * 7)} max={new Date().getTime()} defaultValue={[new Date().getTime() - (31536000000 * 7), new Date().getTime()]} tooltip={{ open: false, }} onChange={onChangeTimeSlider} step={86400000}/>
                          </div>
                        </div>
                      </div>
                      <div  className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                        <div className="flex bothEnds valueBox">
                          <label className="textBold title">통과톤수</label>
                          <div className="flex dataText">
                            <div id="startWearMGT">{wearSearchCondition.startMGT}</div>
                            <div>~</div>
                            <div id="endWearMGT">{wearSearchCondition.endMGT}</div>
                            <div style={{marginLeft: "5px"}}>MGT</div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="sliderContainer">
                            <Slider range={{ draggableTrack: true }} min={0} max={3000} defaultValue={[0, 3000]} tooltip={{ open: false, }} onChange={onChangeMgtSlider} step={50}/>
                          </div>
                        </div>
                      </div>
                      <div className="searchOption selectBox">
                        <div className="title flex textBold">마모예측 상관성</div>
                        <div className="flex">
                            <Select
                              defaultValue=""
                              style={{ width: 190 }}
                              /* onChange={handleChange} */
                              options={
                                [
                                  {value:"누적통과톤수만 고려",label:"누적통과톤수만 고려"},
                                  {value:"레일특성변수 모두고려",label:"레일특성변수 모두고려"}
                                ]
                              }
                            />
                        </div>
                      </div>
                      <div className="searchOption selectBox">
                        <div className="title flex textBold">예측모델</div>
                        <div className="flex">
                            <Select
                              defaultValue=""
                              style={{ width: 190 }}
                              /* onChange={handleChange} */
                              options={
                                [
                                  {value:"선형회귀모형",label:"선형회귀모형"},
                                  {value:"로지스틱 회귀모형",label:"로지스틱 회귀모형"},
                                  {value:"SVM",label:"SVM"},
                                  {value:"랜덤포레스트",label:"랜덤포레스트"},
                                  {value:"XGBoost",label:"XGBoost"},
                                  {value:"Light GBM",label:"Light GBM"},
                                  {value:"CatBoost",label:"CatBoost"}
                                ]
                              }
                            />
                        </div>
                      </div>
                      <div className="flex flexCenter" style={{flexDirection: "row-reverse"}} >
                        <button className="searchButton" onClick={onClickWearSearch}>조회</button>
                      </div>
                    </div>
                      

                  </div>
                </div>
                <div className="contentBox wearContainer" style={{marginLeft : 0, height:"100%"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                    <div className="flex">
                      <ModalCustom buttonLabel="상선상세" title="상선 상세보기" data={wear3dData}></ModalCustom>
                      <ModalCustom buttonLabel="하선상세" title="하선 상세보기" data={wear3dData}></ModalCustom>
                      <div className="modalButton highlight" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen(true);
                      }} >예측데이터 상세보기</div>
                      <div className="modalButton highlight orange" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen2(true);
                      }} >의사결정</div>
                    </div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" data={DIRECTWEARINFO}></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" data={SIDEWEARINFO}></WearInfo>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <div className="popupTitle"><img src={PopupIcon} />예측데이터 상세</div>
            <div className="popupContent">
              <div className="contentBox" style={{ height: "300px", marginTop : "10px", width: "1248px"}} >
                <div className="containerTitle">예측결과
                  <div className="dataOption">
                    <div className="value">
                      Update : 2023.01.25
                    </div>
                  </div>
                </div>
                <div className="componentBox flex section " style={{ paddingTop: "5px",
                      paddingBottom: "5px",
                      height: "calc(100% - 37px)",
                      paddingLeft: "5px",
                      flexDirection: "column",
                      width: "calc( 100% - 12px)" }} >
                  <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                    <div class="optionTitle" style={{width:"212px"}}>예측 누적통과톤수</div>
                    <div class="optionValue">414,953,971</div>
                  </div>
                  <div className="table" style={{ justifyContent: "flex-start" }}>
                    <div className="tableHeader">
                      <div className="tr">
                        <div className="td driving colspan2"><div className="colspan2">열차운행방향</div></div>
                        <div className="td kp colspan2"><div className="colspan2">KP</div></div>
                        <div className="td rail colspan2"><div className="colspan2">좌우레일</div></div>
                        <div className="td mamo colspan2"><div className="colspan2">마모</div></div>
                        <div className="td date colspan2"><div className="colspan2">예측일자</div></div>
                        <div className="td ton colspan2"><div className="colspan2">누적통과톤수</div></div>
                        <div className="td value1 rowspan4"><div className="rowspan4">레일 예측마모량(mm)</div></div>
                        <div className="td value1_1 rowspan4"></div>
                        <div className="td value1_2 rowspan4"></div>
                        <div className="td value1_3 rowspan4"></div>

                        <div className="td value2 colspan2"><div className="colspan2">레일 실측마모량</div></div>
                        <div className="td value3 colspan2"><div className="colspan2">마모량(예측-실측)</div></div>
                        <div className="td value4 rowspan2"><div className="rowspan2">갱환시기 예측</div></div>
                        <div className="td value5 "></div>
                      </div>
                      <div className="tr">
                        <div className="td driving"></div>
                        <div className="td kp"></div>
                        <div className="td rail"></div>
                        <div className="td mamo"></div>
                        <div className="td date "></div>
                        <div className="td ton "></div>

                        <div className="td value1 ">선형회귀</div>
                        <div className="td value1_1 ">XGBoost</div>
                        <div className="td value1_2 ">LightGBM</div>
                        <div className="td value1_3 ">CatBoost</div>

                        <div className="td value2 "></div>
                        <div className="td value3 "></div>
                        <div className="td value4 ">마모량 기준</div>
                        <div className="td value5 ">누적통과톤수기준</div>
                      </div>
                    </div>
                    <div className="tableBody" style={{ overflow: "auto", height: "calc(100% - 48px)", justifyContent: "flex-start"}}>
                      <div className="tr">
                        <div className="td driving">상선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">좌</div>
                        <div className="td mamo">직마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton ">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>

                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">상선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">좌</div>
                        <div className="td mamo">편마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton ">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">상선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">우</div>
                        <div className="td mamo">직마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">상선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">우</div>
                        <div className="td mamo">편마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>

                      <div className="tr">
                        <div className="td driving">하선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">좌</div>
                        <div className="td mamo">직마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton ">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">하선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">좌</div>
                        <div className="td mamo">편마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton ">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">하선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">우</div>
                        <div className="td mamo">직마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                      <div className="tr">
                        <div className="td driving">하선</div>
                        <div className="td kp">14k800</div>
                        <div className="td rail">우</div>
                        <div className="td mamo">편마모</div>
                        <div className="td date ">2024.01.10</div>
                        <div className="td ton">5ton  </div>
                        <div className="td value1 ">10</div>
                        <div className="td value1_1 ">10</div>
                        <div className="td value1_2 ">10</div>
                        <div className="td value1_3 ">10</div>
                        <div className="td value2 ">-</div>
                        <div className="td value3 ">10mm</div>
                        <div className="td value4 ">7.09억톤 - 2029.01.15</div>
                        <div className="td value5 ">6억톤 - 2027.01.15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={open2}
          onClose={(e)=>{handleClose2()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />선로 마모 심각 
              <div className="closeBtn" onClick={()=>{setOpen2(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="contentBox wearContainer" style={{marginLeft : 0, height:"450px"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" data={DIRECTWEARINFO}></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" data={SIDEWEARINFO}></WearInfo>
                    </div>
                  </div>
              </div>

              <div className="comment" style={{ marginTop: "50px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">
                  유지보수 의사결정
                  <div className="radioGroup">
                    <Radio.Group style={RADIO_STYLE} >
                      <Radio value={1}>알람무시</Radio>
                      <Radio value={2}>점검 후 조치</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>

            </div>
            <div className="decisionButtonContainer">
              <div className="button">유지보수 의사결정 등록</div>
            </div>
          </Box>
        </Modal>


    </div>
  );
}

export default WearMaintenance;

