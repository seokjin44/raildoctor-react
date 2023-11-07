import "./monitoring.css";
import 'dayjs/locale/ko';
import { useEffect, useRef, useState } from "react";
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import { DatePicker, Input, Radio } from 'antd';
import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import RailStatus from "../../component/railStatus/railStatus";
import { CHART_RENDERING_TEXT, PICTURE_RENDERING_TEXT, RADIO_STYLE, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_ROUTE_INCHON, STRING_ROUTE_SEOUL, STRING_UP_TRACK } from "../../constant";
import classNames from "classnames";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import DataExistence from "../../component/dataExistence/dataExistence";
import TrackMap from "../../component/trackMap/trackMap";
import axios from 'axios';
import qs from 'qs';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import { convertToCustomFormat, getInchonSpeedData, getRailroadSection, getSeoulSpeedData, nonData } from "../../util";
import Papa from 'papaparse';
import EmptyImg from "../../assets/icon/empty/empty5.png";
import LoadingImg from "../../assets/icon/loading/loading.png";
import Draggable from 'react-draggable';

window.PDFJS = PDFJS;
const { RangePicker } = DatePicker;

function Monitoring( props ) {
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const containerRef = useRef(null);
  const zoomImgcontainerRef = useRef(null);
  const imgRef = useRef(null);
  const zoomimgRef = useRef(null);

  const [routeHidden, setRouteHidden] = useState(false);
  const [kp, setKP] = useState(0);
  const [inputKp, setInputKp] = useState(0);
  const [railmapOpen, setRailmapOpen] = useState(false);
  const [viewRailMap, setViewRailMap] = useState(null);
  const [kpMarker, setKPMarker] = useState({x : 0, y : 0});
  
  const [zoomImgkpMarker, setZoomImgKPMarker] = useState(0);
  const [zoomImgkpMarkerHeight, setZoomImgkpMarkerHeight] = useState(0);
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const inputRef = useRef(null);

  const [accumulateWeights, setAccumulateWeights] = useState([]);
  const [railbehaviors, setRailbehaviors] = useState([]);
  const [railtwists, setRailtwists] = useState([]);
  const [railwears, setRailwears] = useState([]);
  const [temperatures, setTemperatures] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  const [paut, setPaut] = useState([]);
  const [trackSpeedData, setTrackSpeedData] = useState([{trackName:"", data:[]},{trackName:"", data:[]}]);
  const [trackSpeedFindClosest, setTrackSpeedFindClosest] = useState([]);
  
  const [trackGeo, setTrackGeo] = useState({});
  const [selectDates, setSelectDates] = useState(null);
  const [pictureList, setpictureList ] = useState([]);
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDrag = (e, data) => {
    console.log(e, data);
    console.log("handleDrag");
    const newPosition = data.x; // X축 위치
    const km = findKmFromPosition(newPosition, pictureList, scales);
    setInputKp(Math.floor(km * 1000));
    setKPMarker({x : data.x, y : 0});
  };

  const findKmFromPosition = (position, pictureList, scales) => {
    let accumulatedWidth = 0;

    for (let i = 0; i < pictureList.length; i++) {
        const pic = pictureList[i];
        const scale = scales[i];
        const scaledWidth = pic.width * scale;

        if (position <= accumulatedWidth + scaledWidth) { // 해당 이미지 범위 안에 위치하는 경우
            const positionInCurrentPic = (position - accumulatedWidth) / scale;
            const kmRatio = positionInCurrentPic / pic.width;
            return pic.beginKp + kmRatio * (pic.endKp - pic.beginKp);
        }
        accumulatedWidth += scaledWidth;
    }

    return null; // 주어진 position 값이 유효하지 않은 경우
  }

  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    //setSelectedPath(select);
    setKP(select.beginKp);
    setInputKp(Math.floor(select.beginKp));
  }

  const getTrackGeo = ( kp_ ) => {
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/railroads/rails',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        kp :  parseInt(kp_) / 1000 
      }
    })
    .then(response => {
      console.log(response.data);
      setTrackGeo(response.data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  useEffect( ()=> {
    /* let find = findPictureAndPosition( parseInt(kp) / 1000 );
    setViewRailMap(find); */
    try{
      console.log(findPositionInPictureList(parseInt(kp)/1000, pictureList, scales));
      let pos = findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position;
      setKPMarker({x : findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position, y : 0});
      containerRef.current.scrollLeft = pos - (containerRef.current.offsetWidth / 2);
    }catch(e){

    }
    getTrackGeo(kp);
  },[kp]);

  useEffect( ()=>{
    getRailroadSection(setRailroadSection);
    console.log("monitoring init");
    let route = sessionStorage.getItem('route');
    if( route === STRING_ROUTE_INCHON ){
      getInchonSpeedData(setTrackSpeedData);
    }else if( route === STRING_ROUTE_SEOUL ){
      getSeoulSpeedData(setTrackSpeedData);
    }
    
    axios.get(`https://raildoctor.suredatalab.kr/api/railroads/railroadmap`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route
      }
    })
    .then(response => {
      let maxHeight = 0;
      console.log(response.data);
      /* "https://raildoctor.suredatalab.kr/resources/data/railroads/railroadmap/c1e7c0a1-e425-4793-9e91-933f003b1cb9.jpeg" */
      let pictureList_ = response.data.entities;
      pictureList_.forEach( item => {if(maxHeight < item.height){maxHeight=item.height}});
      setpictureList(pictureList_);
      setZoomImgkpMarkerHeight(maxHeight);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [] )

  const getExistData = ( dates ) => {
    let route = sessionStorage.getItem('route');
    axios.get(`https://raildoctor.suredatalab.kr/api/statistics/data`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        beginTs : dates[0].$d.toISOString(),
        endTs : dates[1].$d.toISOString(),
        /* beginKp : 0.23,
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
      setPaut(response.data.pauts);
    })
    .catch(error => console.error('Error fetching data:', error));
/*     axios.get(`https://raildoctor.suredatalab.kr/api/pauts`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        beginTs : dates[0].$d.toISOString(),
        endTs : dates[1].$d.toISOString(),
      }
    })
    .then(response => {
      console.log(response.data);
      setPaut(response.data.entities);
    })
    .catch(error => console.error('Error fetching data:', error)); */
  }

  const handleImageLoad = (index) => {
    if (!containerRef.current) return;

    const img = containerRef.current.querySelectorAll('img.map')[index];
    const displayedHeight = img.offsetHeight;
    const originalHeight = pictureList[index].height;
    const newScale = displayedHeight / originalHeight;
    setScales(prevScales => {
        const updatedScales = [...prevScales];
        updatedScales[index] = newScale;
        console.log(updatedScales);
        // 모든 이미지가 로드되었는지 확인
        if (updatedScales.every(scale => scale !== null && scale !== undefined)) {
          setLoading(false); // 모든 이미지가 로드되었으면 로딩 상태를 false로 변경
        }

        return updatedScales;
    });
  };

  const findPositionInPictureList = (km, pictureList, scales) => {
    let accumulatedWidth = 0;

    for (let i = 0; i < pictureList.length; i++) {
        const pic = pictureList[i];
        const scale = scales[i];

        if (pic.beginKp <= km && km <= pic.endKp) {
            const positionInCurrentPic = ((km - pic.beginKp) / (pic.endKp - pic.beginKp)) * pic.width;
            return {
                url: pic.url,
                originalWidth: pic.width,
                position: Math.round(accumulatedWidth + (positionInCurrentPic * scale)),
                originalHeight: pic.height
            };
        }
        accumulatedWidth += pic.width * scale;
    }

    return null;
  }

  const zoomFindPositionInPictureList = (km, pictureList) => {
    let accumulatedWidth = 0;
    for (let pic of pictureList) {
        if (pic.beginKp <= km && km <= pic.endKp) {
            const positionInCurrentPic = ((km - pic.beginKp) / (pic.endKp - pic.beginKp)) * pic.width;
            return {
                url: pic.url,
                originalWidth: pic.width,
                position: Math.round(accumulatedWidth + (positionInCurrentPic)),
                originalHeight: pic.height
            };
        }
        accumulatedWidth += pic.width;
    }
    return null;
  }

  const [resizeOn, setResizeOn] = useState(0);
  const resizeChange = () => {
    console.log("resizeChange");
    setResizeOn(prevScales=>{
      return prevScales+1
    });
  }
  useEffect(() => {
    // 이벤트 리스너 추가
    
    window.addEventListener('resize', resizeChange);
    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {window.removeEventListener('resize', resizeChange )};
  }, []); // 빈 의존성 배열을 전달하여 마운트 및 언마운트 시에만 실행되도록 함

  return (
    <div className="monitoringContainer" >
        <div className="railStatusContainer">
          <RailStatus 
            resizeOn={resizeOn}
            railroadSection={railroadSection} 
            pathClick={pathClick}
          ></RailStatus>
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
                    value={selectDates}
                    defaultValue={selectDates}
                    style={RANGEPICKERSTYLE}
                    onChange={(e)=>{
                      console.log(e);
                      setSelectDates(e);
                      if( e === null ){
                        return;
                      }
                      getExistData(e);
                    }}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="track">
                  <Radio.Group style={RADIO_STYLE} defaultValue={selectTrack} value={selectTrack}
                    onChange={(e)=>{setSelectTrack(e.target.value)}}
                  >
                    <Radio value={STRING_UP_TRACK}>상선</Radio>
                    <Radio value={STRING_DOWN_TRACK}>하선</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input 
                    value={inputKp}
                    defaultValue={inputKp}
                    placeholder="KP" 
                    onKeyDown={(e)=>{
                      if(e.key==="Enter"){
                        setKP(e.target.value);
                      }
                    }}
                    onChange={(e)=>{
                      const { value: inputValue } = e.target;
                      const reg = /^-?\d*(\.\d*)?$/;
                      if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
                        setInputKp(e.target.value);
                      }
                    }}
                    style={RANGEPICKERSTYLE}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption linear " style={{marginLeft:"10px"}}>
                <div className="title border">상선 </div>
                {nonData(trackGeo?.t2?.shapeDisplay)} / R={nonData(trackGeo?.t2?.direction)} <br/>
                {nonData(trackGeo?.t2?.radius)} (C={nonData(trackGeo?.t2?.cant)}, S={nonData(trackGeo?.t2?.slack)})
              </div>
              <div className="dataOption linear " style={{marginLeft:"10px"}}>
                <div className="title border">하선 </div>
                {nonData(trackGeo?.t1?.shapeDisplay)} / R={nonData(trackGeo?.t1?.direction)} <br/>
                {nonData(trackGeo?.t1?.radius)} (C={nonData(trackGeo?.t1?.cant)}, S={nonData(trackGeo?.t1?.slack)})
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={()=>{
                  console.log("Search");
                  setKP(inputKp);
                }} >
                  조회
                </button>
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
            <div ref={containerRef} className={classNames("componentBox separationBox",{hidden : routeHidden} )} style={{overflow: "auto"}}  id="viewMapScroll"
            >
              { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{PICTURE_RENDERING_TEXT}</div> : null }
              <div className="boxProto track">
                {
                  pictureList.map( (pic, index) => {
                    return <img className="map" key={index} alt="선로열람도" src={`https://raildoctor.suredatalab.kr${pic.fileName}`} onLoad={() => handleImageLoad(index)} />
                  })
                }
                <Draggable axis="x" onDrag={handleDrag} position={kpMarker}>
                  <div className="kpMarker" ></div>
                </Draggable>
              </div>
            </div>
          </div>

          <div className="contentBox" style={{marginLeft : 0, height: "190px"}}>
            <div className="containerTitle bothEnds">
              <div>속도정보</div>
              <div className="selectKPInfo">
                선택된 KP : {convertToCustomFormat(kp)}
                {
                  trackSpeedFindClosest.map( closest => {
                    return <><div style={{backgroundColor : closest.color}} className="closestIcon"></div><div style={{marginLeft: "5px"}}>{closest.name}</div><div>: {`${closest.speed}km/h`}</div></>;
                  })
                }
              </div>
            </div>
            <div className="componentBox separationBox">
              <div className="boxProto speed">
                <TrackSpeed 
                  resizeOn={resizeOn}
                  data={trackSpeedData} kp={kp} 
                  findClosest={(e)=>{setTrackSpeedFindClosest(e)}}
                ></TrackSpeed>
              </div>
            </div>
          </div>

          <div className="contentBox" style={{marginLeft : 0}}>
            <div className="containerTitle bothEnds">
              <div>데이터여부</div>
              {/* <div className="dataOption">
                <div className="date">
                  <img src={CalendarIcon} />
                  2022.01.01 ~ 2023.05.05
                </div>
              </div> */}
            </div>
            <div className="componentBox separationBox">
                {
                  (accumulateWeights.length < 1 && railbehaviors.length < 1 && railtwists.length < 1 &&
                    railwears.length < 1 && temperatures.length < 1 && paut.length < 1  
                  ) ? 
                  <div className="emptyBox" style={{ height: "340px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    width: "calc(100% - 22px)",
                    marginLeft: "10px",
                    marginRight: "10px"}}>
                    <img src={EmptyImg} />
                    <h1>데이터가 없습니다</h1>
                    <div>
                    출력할 데이터가 없습니다. <br/>
                    상단에서 날짜를 지정해주세요.
                    </div>
                  </div>
                  :
                  <DataExistence 
                  kp={kp}
                  accumulateWeights={accumulateWeights}
                  railbehaviors={railbehaviors}
                  railtwists={railtwists}
                  railwears={railwears}
                  temperatures={temperatures}
                  paut={paut}
                ></DataExistence>
                }
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
          <div className="zoomImgContainer" ref={zoomImgcontainerRef}>
            <div className="kpMarker" style={{
              left:`${zoomImgkpMarker}px`,
              height : `${zoomImgkpMarkerHeight}px`
            }}></div>
              {
                pictureList.map( (pic, index) => {
                  return <img className="map" key={index} alt="선로열람도" src={`https://raildoctor.suredatalab.kr${pic.fileName}`} onLoad={() => {
                    let pos = zoomFindPositionInPictureList(parseInt(kp)/1000, pictureList).position;
                    setZoomImgKPMarker(pos);
                    zoomImgcontainerRef.current.scrollLeft = pos - (zoomImgcontainerRef.current.offsetWidth / 2);
                  }} />
                })
              }
          </div>
        </Box>
      </Modal> 
    </div>
  );
}

export default Monitoring;
