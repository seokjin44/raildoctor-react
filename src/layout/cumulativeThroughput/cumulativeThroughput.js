import "./cumulativeThroughput.css";
import 'dayjs/locale/ko';
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useRef, useState } from "react";
import { DatePicker, Input } from 'antd';
import { Radio } from 'antd';
import { KP_SEARCH_RANGE, KP_SEARCH_SINGLE, PICTURE_RENDERING_TEXT, RADIO_STYLE, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_PATH, STRING_STATION, STRING_TRACK_DIR_LEFT, STRING_TRACK_DIR_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT } from "../../constant";
import axios from 'axios';
import qs from 'qs';
import { convertToCustomFormat, dateFormat, formatDateTime, getRailroadSection, getRoute, getTrackText, getYear2Length, nonData, numberWithCommas } from "../../util";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import classNames from "classnames";
import moment from 'moment';
import LoadingImg from "../../assets/icon/loading/loading.png";
import Draggable from 'react-draggable';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

let route = getRoute();
function CumulativeThroughput( props ) {

  const zoomImgcontainerRef = useRef(null);
  const zoomimgRef = useRef(null);
  const [zoomImgkpMarker, setZoomImgKPMarker] = useState(0);
  const [zoomImgkpMarkerHeight, setZoomImgkpMarkerHeight] = useState(0);

  const [kp, setKP] = useState(0);
  const [endkp, setendKp] = useState(0);
  const [inputKp, setInputKp] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [kpMarker, setKPMarker] = useState({x : 0, y : 0});
  const [viewRailMap, setViewRailMap] = useState(null);
  const [selectDate, setSelectDate] = useState(moment());
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [selectDir, setSelectDir] = useState(STRING_TRACK_DIR_LEFT);
  const [selectSearch, setSelectSearch] = useState(KP_SEARCH_SINGLE);
  const [railmapOpen, setRailmapOpen] = useState(false);

  const [remainingCriteria, setRemainingCriteria] = useState(0);
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});
  const [remainings, setRemainings] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  
  const [remainingReturn, setRemainingReturn] = useState("");
  const [trackGeo, setTrackGeo] = useState({shapeDisplay : "Shape"});
  const [mapHide, setMapHide] = useState(false);
  const [pictureList, setpictureList ] = useState([]);
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);
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

    getRailroadSection(setRailroadSection);
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
    
      // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
      return () => {window.removeEventListener('resize', resizeChange )};
  }, []);

  useEffect(() => {
/*     let find = findPictureAndPosition( parseInt(kp) / 1000);
    setViewRailMap(find); */
    try{
      console.log(findPositionInPictureList(parseInt(kp)/1000, pictureList, scales));
      let pos = findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position;
      setKPMarker({x : findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position, y : 0});
      containerRef.current.scrollLeft = pos - (containerRef.current.offsetWidth / 2);
    }catch(e){

    }

    axios.get('https://raildoctor.suredatalab.kr/api/railroads/rails',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        kp :  parseInt(kp) / 1000 
      }
    })
    .then(response => {
      console.log(response.data);
      setTrackGeo(response.data);
      if( selectTrack === STRING_UP_TRACK ){
        setTrackGeo(response.data.t2);
      }else if( selectTrack === STRING_DOWN_TRACK ){
        setTrackGeo(response.data.t1);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [kp, selectTrack]);

  const handleImageLoad = (index) => {
    if (!containerRef.current) return;

    const img = containerRef.current.querySelectorAll('img.map')[index];
    const displayedHeight = img.offsetHeight;
    const originalHeight = pictureList[index].height;
    const newScale = displayedHeight / originalHeight;
    console.log(index);
    setScales(prevScales => {
        const updatedScales = [...prevScales];
        updatedScales[index] = newScale;
        
        // 모든 이미지가 로드되었는지 확인
        if (updatedScales.every(scale => scale !== null)) {
          setLoading(false); // 모든 이미지가 로드되었으면 로딩 상태를 false로 변경
        }

        return updatedScales;
    });
  };

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
        // 이미지 너비에 devicePixelRatio를 곱하여 조정
        let adjustedWidth = pic.width * window.devicePixelRatio;

        if (pic.beginKp <= km && km <= pic.endKp) {
            // 조정된 너비를 사용하여 위치 계산
            const positionInCurrentPic = ((km - pic.beginKp) / (pic.endKp - pic.beginKp)) * adjustedWidth;
            return {
                url: pic.url,
                originalWidth: pic.width,
                position: Math.round(accumulatedWidth + positionInCurrentPic),
                originalHeight: pic.height
            };
        }
        // 조정된 너비로 accumulatedWidth 업데이트
        accumulatedWidth += adjustedWidth;
    }
    return null;
  };

  useEffect( () => {
    try{
      console.log(findPositionInPictureList(parseInt(kp)/1000, pictureList, scales));
      let pos = findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position;
      setKPMarker({x : findPositionInPictureList(parseInt(kp)/1000, pictureList, scales).position, y : 0});
      containerRef.current.scrollLeft = pos - (containerRef.current.offsetWidth / 2);
    }catch(e){

    }
  }, [mapHide])

  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
    setKP(select.beginKp);
    setInputKp(Math.floor(select.beginKp));
    setendKp(Math.floor(select.endKp));
    if( select.type === STRING_STATION ){
      setSelectSearch(KP_SEARCH_SINGLE);
      getAccRemainingData(select.beginKp);
    }else{
      setSelectSearch(KP_SEARCH_RANGE);
      getAccRemainingsData(select.beginKp, select.endKp);
    }
  }

  const getAccRemainingData = (kp_)=>{
    if( !kp_ || kp_ === "" || kp_ === null || kp_ === undefined){
      alert("KP를 입력해주세요");
      return;
    }
    let track_ = "";
    if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
      track_ = STRING_UP_TRACK_LEFT;
    }else if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
      track_ = STRING_UP_TRACK_RIGHT;
    }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
      track_ = STRING_DOWN_TRACK_LEFT;
    }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
      track_ = STRING_DOWN_TRACK_RIGHT;
    }

    let param  = {
      railroad_name : route,
      measure_ts : selectDate.toISOString(),
      rail_track : track_,
      kp : (kp_ / 1000)
    }
    console.log(param);
    axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remaining`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setRemainingCriteria(response.data.criteria);
      setLeftRemaining(response.data.leftRemaining);
      setRightRemaining(response.data.rightRemaining);
      setRemainingReturn(STRING_STATION);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getAccRemainingsData = (beginKp, endKp)=>{
    if( !beginKp || beginKp === "" || beginKp === null || beginKp === undefined ||
        !endKp || endKp === "" || endKp === null || endKp === undefined){
      alert("KP를 입력해주세요");
      return;
    }
    let track_ = "";
    if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
      track_ = STRING_UP_TRACK_LEFT;
    }else if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
      track_ = STRING_UP_TRACK_RIGHT;
    }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
      track_ = STRING_DOWN_TRACK_LEFT;
    }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
      track_ = STRING_DOWN_TRACK_RIGHT;
    }
    
    let param  = {
      railroad_name : route,
      measure_ts : selectDate.toISOString(),
      rail_track : track_,
      begin_kp: (beginKp / 1000),
      end_kp : (endKp / 1000)
    }
    console.log(param);
    axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remainings`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setRemainings(response.data.remainings);
      setRemainingReturn(STRING_PATH);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  return (
    <div className="cumulativeThroughput" >
      <div className="railStatusContainer">
        <RailStatus 
          resizeOn={resizeOn}
          railroadSection={railroadSection} 
          pathClick={pathClick}
        ></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">조회일자 </div>
                <div className="date">
                  <DatePicker 
                    defaultValue={dayjs()}
                    style={RANGEPICKERSTYLE}
                    onChange={(e)=>{
                      if(e === null){
                        setSelectDate(moment().startOf('day'));
                        return;
                      }
                      console.log(e.$d);
                      const selectedDate = new Date(e.$d);
                      const utcDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0));
                      setSelectDate(utcDate);
                    }}
                  />
                </div>
              </div>
              {/* <div className="line"></div>
              <div className="dataOption">
                <div className="title">검토일자 </div>
                <div className="date">
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div> */}
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">{getTrackText("상하선", route)} </div>
                <div className="track">
                  <Radio.Group style={RADIO_STYLE} defaultValue={selectTrack} value={selectTrack}
                    onChange={(e)=>{setSelectTrack(e.target.value)}}
                  >
                    <Radio value={STRING_UP_TRACK}>{getTrackText("상선", route)}</Radio>
                    <Radio value={STRING_DOWN_TRACK}>{getTrackText("하선", route)}</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">좌우 </div>
                <div className="track">
                  <Radio.Group style={RADIO_STYLE} defaultValue={selectDir} value={selectDir} 
                    onChange={(e)=>{setSelectDir(e.target.value)}}
                  >
                    <Radio value={STRING_TRACK_DIR_LEFT}>좌</Radio>
                    <Radio value={STRING_TRACK_DIR_RIGHT}>우</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">검색 </div>
                <div className="track">
                  <Radio.Group style={RADIO_STYLE} defaultValue={selectSearch} value={selectSearch} 
                    onChange={(e)=>{setSelectSearch(e.target.value)}}
                  >
                    <Radio value={KP_SEARCH_SINGLE}>단일</Radio>
                    <Radio value={KP_SEARCH_RANGE}>범위</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption" style={{ width: "330px", justifyContent: "left" }}>
                {
                  (selectSearch === KP_SEARCH_RANGE) ? 
                  <>
                    <div className="title">시작KP </div>
                    <div className="">
                      <Input placeholder="KP" 
                        value={inputKp}
                        defaultValue={inputKp}
                        style={RANGEPICKERSTYLE} 
                        /* onKeyDown={(e)=>{ if(e.key==="Enter"){
                          setKP(e.target.value);
                        }}} */
                        onChange={(e)=>{
                          const { value: inputValue } = e.target;
                          const reg = /^-?\d*(\.\d*)?$/;
                          if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
                            setInputKp(e.target.value);
                          }
                        }}
                      />
                    </div>          
                    <div className="line" style={{ marginLeft: "5px", marginRight: "5px" }}></div>      
                    <div className="title">종점KP </div>
                    <div className="">
                      <Input placeholder="KP" 
                        value={endkp}
                        defaultValue={endkp}
                        style={RANGEPICKERSTYLE} 
                        /* onKeyDown={(e)=>{ if(e.key==="Enter"){
                          setendKp(e.target.value);
                        }}} */
                        onChange={(e)=>{
                          const { value: inputValue } = e.target;
                          const reg = /^-?\d*(\.\d*)?$/;
                          if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
                            setendKp(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </>
                  : 
                  <>
                    <div className="title">KP </div>
                    <div className="">
                      <Input placeholder="KP" 
                        value={inputKp}
                        defaultValue={inputKp}
                        style={RANGEPICKERSTYLE} 
                        /* onKeyDown={(e)=>{ if(e.key==="Enter"){
                          setKP(e.target.value);
                        }}} */
                        onChange={(e)=>{
                          const { value: inputValue } = e.target;
                          const reg = /^-?\d*(\.\d*)?$/;
                          if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
                            setInputKp(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </>

                }
                
              </div>
              <div className="dataOption" style={{marginLeft:"10px",width:"190px"}}>
               {nonData(trackGeo?.shapeDisplay)} <br/>
                R={nonData(trackGeo?.direction)} {nonData(trackGeo?.radius)} (C={nonData(trackGeo?.cant)}, S={nonData(trackGeo?.slack)})
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={()=>{
                  console.log("Search");
                  setKP(inputKp);
                  if( selectSearch === KP_SEARCH_SINGLE ){
                    getAccRemainingData(inputKp);
                  }else{
                    if( inputKp > endkp ){
                      alert("시작KP가 종점KP보다 큽니다.");
                      return;
                    }
                    getAccRemainingsData(inputKp, endkp);
                  }
                }} >
                  조회
                </button>
              </div>
            </div>
      </div>
      <div className="contentBox" 
        style={{height:"calc(100% - 245px)", position:"relative"}} id="trackMapBox"
      >
        <div className="containerTitle">
          <div>검토구간</div>
          <div className="flex">
            <div className="modalButton" onClick={()=>{
                      console.log("선로열람도 숨기기");
                      setMapHide(!mapHide);
            }} >선로열람도 {(mapHide)? "펼치기" : "숨기기"}</div>
            <div className="modalButton highlight" onClick={()=>{
                      console.log("선로열람도 상세보기");
                      setRailmapOpen(true);
            }} >선로열람도 상세보기</div>
          </div>
        </div>
        <div className="componentBox">
          { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{PICTURE_RENDERING_TEXT}</div> : null }
          <div ref={containerRef} className={classNames("boxProto track",{"hide" : mapHide})} id="trackMapContainer" >
          {
            pictureList.map( (pic, index) => {
              return <img className="map" key={index} alt="선로열람도" src={`https://raildoctor.suredatalab.kr${pic.fileName}`} onLoad={() => handleImageLoad(index)} />
            })
          }
          <Draggable axis="x" onDrag={handleDrag} position={kpMarker}>
            <div className="guideLine" id="guideLine"></div>
          </Draggable>
          </div>
          <div className="dataContainer">
            {
              ( remainingReturn === STRING_STATION ) ? 
              <>
                <div className="dataLine">
                  <div className="table">
                    <div className="tableHeader">
                      <div className="tr">
                        <div className="td">좌우</div>
                        {/* <div className="td">시점</div>
                        <div className="td">종점</div>
                        <div className="td">연장</div>
                        <div className="td">교체</div>
                        <div className="td">계측</div> */}
                        <div className="td">기준</div>
                        <div className="td">누적</div>
                        {/* <div className="td">일평균</div> */}
                        <div className="td">잔여톤수('{getYear2Length(new Date(rightRemaining.standardMeasureTs))}년 기준)</div>
                        <div className="td">갱환예상</div>
                        {/* <div className="td">first</div>
                        <div className="td">second</div> */}
                        <div className="td">갱환/부설일자</div>
                      </div>
                    </div>
                    <div className="tableBody">
                      <div className="tr">
                        <div className="td">우</div>
                        {/* <div className="td">117</div>
                        <div className="td">669</div>
                        <div className="td">552</div>
                        <div className="td">2007-03-16</div>
                        <div className="td">2021-12-31</div> */}
                        <div className="td">{numberWithCommas(remainingCriteria)}</div>
                        <div className="td">{numberWithCommas(rightRemaining.accumulateweight)}</div>
                        {/* <div className="td">41,915</div> */}
                        <div className="td">{numberWithCommas(rightRemaining.remainingWeight)}</div>
                        <div className="td">{dateFormat(new Date(rightRemaining.nextTimeToReplace))}</div>

                        {/* <div className="td">{formatDateTime(new Date(leftRemaining.firstMeasureTs))}</div>
                        <div className="td">{formatDateTime(new Date(leftRemaining.secondMeasureTs))}</div> */}
                        <div className="td">{dateFormat(new Date(leftRemaining.zeroMeasureTs))}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dataLine">
                  <div className="table">
                    <div className="tableHeader">
                      <div className="tr">
                        <div className="td">좌우</div>
                        {/* <div className="td">시점</div>
                        <div className="td">종점</div>
                        <div className="td">연장</div>
                        <div className="td">교체</div>
                        <div className="td">계측</div> */}
                        <div className="td">기준</div>
                        <div className="td">누적</div>
                        {/* <div className="td">일평균</div> */}
                        <div className="td">잔여톤수('{getYear2Length(new Date(leftRemaining.standardMeasureTs))}년 기준)</div>
                        <div className="td">갱환예상</div>
                        {/* <div className="td">first</div>
                        <div className="td">second</div> */}
                        <div className="td">갱환/부설일자</div>
                      </div>
                    </div>
                    <div className="tableBody">
                      <div className="tr">
                        <div className="td">좌</div>
                        {/* <div className="td">117</div>
                        <div className="td">669</div>
                        <div className="td">552</div>
                        <div className="td">2007-03-16</div>
                        <div className="td">2021-12-31</div> */}
                        <div className="td">{numberWithCommas(remainingCriteria)}</div>
                        <div className="td">{numberWithCommas(leftRemaining.accumulateweight)}</div>
                        {/* <div className="td">41,915</div> */}
                        <div className="td">{numberWithCommas(leftRemaining.remainingWeight)}</div>
                        <div className="td">{dateFormat(new Date(leftRemaining.nextTimeToReplace))}</div>

                        {/* <div className="td">{formatDateTime(new Date(leftRemaining.firstMeasureTs))}</div>
                        <div className="td">{formatDateTime(new Date(leftRemaining.secondMeasureTs))}</div> */}
                        <div className="td">{dateFormat(new Date(leftRemaining.zeroMeasureTs))}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              : 
              ( remainingReturn === STRING_PATH ) ?
              <>
                <div className="dataLine">
                  <div className="table">
                    <div className="tableHeader">
                      <div className="tr">
                        <div className="td">좌우</div>
                        {/* <div className="td">시점</div>
                        <div className="td">종점</div>
                        <div className="td">연장</div>
                        <div className="td">교체</div>
                        <div className="td">계측</div> */}
                        <div className="td">시작KP</div>
                        <div className="td">종점KP</div>
                        <div className="td">기준</div>
                        <div className="td">누적</div>
                        {/* <div className="td">일평균</div> */}
                        <div className="td">잔여톤수</div>
                        <div className="td">갱환예상</div>
                        {/* <div className="td">first</div>
                        <div className="td">second</div> */}
                        <div className="td">갱환/부설일자</div>
                      </div>
                    </div>
                    <div className="tableBody">
                      {remainings.map( (remaining, i) => {
                        return <>
                        <div key={`left${i}`} className="tr">
                          <div className="td">좌</div>
                          {/* <div className="td">117</div>
                          <div className="td">669</div>
                          <div className="td">552</div>
                          <div className="td">2007-03-16</div>
                          <div className="td">2021-12-31</div> */}
                          <div className="td">{convertToCustomFormat(remaining.leftRemaining.beginKp*1000)}</div>
                          <div className="td">{convertToCustomFormat(remaining.leftRemaining.endKp*1000)}</div>
                          <div className="td">{numberWithCommas(remaining.criteria)}</div>
                          <div className="td">{numberWithCommas(remaining.leftRemaining.accumulateweight)}</div>
                          {/* <div className="td">41,915</div> */}
                          <div className="td">{numberWithCommas(remaining.leftRemaining.remainingWeight)}</div>
                          <div className="td">{dateFormat(new Date(remaining.leftRemaining.nextTimeToReplace))}</div>

                          {/* <div className="td">{formatDateTime(new Date(remaining.leftRemaining.firstMeasureTs))}</div>
                          <div className="td">{formatDateTime(new Date(remaining.leftRemaining.secondMeasureTs))}</div> */}
                          <div className="td">{dateFormat(new Date(remaining.leftRemaining.zeroMeasureTs))}</div>
                        </div>
                        <div key={`right${i}`} className="tr">
                          <div className="td">우</div>
                          {/* <div className="td">117</div>
                          <div className="td">669</div>
                          <div className="td">552</div>
                          <div className="td">2007-03-16</div>
                          <div className="td">2021-12-31</div> */}
                          <div className="td">{convertToCustomFormat(remaining.rightRemaining.beginKp*1000)}</div>
                          <div className="td">{convertToCustomFormat(remaining.rightRemaining.endKp*1000)}</div>
                          <div className="td">{numberWithCommas(remaining.criteria)}</div>
                          <div className="td">{numberWithCommas(remaining.rightRemaining.accumulateweight)}</div>
                          {/* <div className="td">41,915</div> */}
                          <div className="td">{numberWithCommas(remaining.rightRemaining.remainingWeight)}</div>
                          <div className="td">{dateFormat(new Date(remaining.rightRemaining.nextTimeToReplace))}</div>

                          {/* <div className="td">{formatDateTime(new Date(remaining.rightRemaining.firstMeasureTs))}</div>
                          <div className="td">{formatDateTime(new Date(remaining.rightRemaining.secondMeasureTs))}</div> */}
                          <div className="td">{dateFormat(new Date(remaining.rightRemaining.zeroMeasureTs))}</div>
                        </div>
                      </>
                      })}
                      
                    </div>
                  </div>
                </div>
              </>
              : null
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

export default CumulativeThroughput;
