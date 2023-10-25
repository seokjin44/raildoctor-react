import "./cumulativeThroughput.css";
import 'dayjs/locale/ko';
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useRef, useState } from "react";
import { DatePicker, Input } from 'antd';
import { Radio } from 'antd';
import { RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_PATH, STRING_STATION, STRING_TRACK_DIR_LEFT, STRING_TRACK_DIR_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT } from "../../constant";
import classNames from "classnames";
import axios from 'axios';
import qs from 'qs';
import { convertToCustomFormat, formatDateTime, getRailroadSection, getYear2Length, numberWithCommas } from "../../util";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";

let pictureList = [];
function CumulativeThroughput( props ) {

  const zoomImgcontainerRef = useRef(null);
  const zoomimgRef = useRef(null);
  const [zoomImgkpMarker, setZoomImgKPMarker] = useState(0);

  const [kp, setKP] = useState(0);
  const [inputKp, setInputKp] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [kpMarker, setKPMarker] = useState(0);
  const [viewRailMap, setViewRailMap] = useState(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [selectDir, setSelectDir] = useState(STRING_TRACK_DIR_LEFT);
  const [railmapOpen, setRailmapOpen] = useState(false);

  const [remainingCriteria, setRemainingCriteria] = useState(0);
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});
  const [remainings, setRemainings] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  
  const [trackGeo, setTrackGeo] = useState({});

  const zoomImgAdjustPosition = () => {
    if (zoomimgRef.current) {
        const scaleFactor = zoomimgRef.current.clientWidth / viewRailMap.originalWidth;
        const adjustedPosition = viewRailMap.position * scaleFactor;
        /* setKPMarker(adjustedPosition); */
        /* zoomImgcontainerRef.current.scrollLeft = adjustedPosition - (zoomImgcontainerRef.current.offsetWidth / 2); */
        let center = (zoomImgcontainerRef.current.offsetWidth / 2);
        console.log(center);
        setZoomImgKPMarker(adjustedPosition);
        zoomImgcontainerRef.current.scrollLeft = adjustedPosition - center;
    }
  }
  
  const findPictureAndPosition = (km) => {
    for (let pic of pictureList) {
        if (pic.beginKp <= km && km <= pic.endKp) {
            const position = ((km - pic.beginKp) / (pic.endKp - pic.beginKp)) * pic.width;
            return { 
              url: `https://raildoctor.suredatalab.kr${pic.fileName}`, 
              originalWidth: pic.width, 
              position: Math.round(position),
              originalHeight: pic.height
            };
        }
    }
    return null;
  }

  const adjustPosition = () => {
    if (imgRef.current) {
        const scaleFactor = imgRef.current.clientWidth / viewRailMap.originalWidth;
        const adjustedPosition = viewRailMap.position * scaleFactor;
        console.log(adjustedPosition);
        setKPMarker(adjustedPosition);
        containerRef.current.scrollLeft = adjustedPosition - (containerRef.current.offsetWidth / 2);
    }
  }

  useEffect(() => {
/*     axios.get('https://devel.suredatalab.kr/api/accumulateweights/remaining',{
      params : {
        operator : "인천",
        lineNo : 1,
        railTrack : "T1L",
        kp : 500,
        measureTs : "2023-01-25",
        railroadName : "계양",
      }
    })
    .then(response => console.log(response.data))
    .catch(error => console.error('Error fetching data:', error)); */
    /* readyImg(); */
    getRailroadSection(setRailroadSection);
    let route = sessionStorage.getItem('route');
    axios.get(`https://raildoctor.suredatalab.kr/api/railroads/railroadmap`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route
      }
    })
    .then(response => {
      console.log(response.data);
      /* "https://raildoctor.suredatalab.kr/resources/data/railroads/railroadmap/c1e7c0a1-e425-4793-9e91-933f003b1cb9.jpeg" */
      pictureList = response.data.entities;
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    let find = findPictureAndPosition( parseInt(kp) / 1000);
    setViewRailMap(find);
    getAccRemainingData();

    let route = sessionStorage.getItem('route');
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
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [kp]);

  useEffect( () => {
    adjustPosition();
  }, [viewRailMap] )

  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
    setKP(select.beginKp);
    setInputKp(select.beginKp);
  }

  const getAccRemainingData = ()=>{
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
    console.log((kp / 1000));
    let route = sessionStorage.getItem('route');
    let param  = {
      railroad_name : route,
      measure_ts : selectDate.toISOString(),
      rail_track : track_,
      kp : (kp / 1000)
      /* begin_kp: (e.target.value / 1000),
      end_kp : (e.target.value / 1000) + 0.99 */
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
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getAccRemainingsData = ()=>{
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
    
    let route = sessionStorage.getItem('route');
    let param  = {
      railroad_name : route,
      measure_ts : selectDate.toISOString(),
      rail_track : track_,
      begin_kp: (selectedPath.beginKp / 1000),
      end_kp : (selectedPath.endKp / 1000)
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
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  useEffect( ()=>{
    getAccRemainingsData();
  }, [selectedPath]);

  return (
    <div className="cumulativeThroughput" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
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
                    style={RANGEPICKERSTYLE}
                    onChange={(e)=>{
                      console.log(e.$d);
                      setSelectDate(e.$d);
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
                <div className="title">상하선 </div>
                <div className="date">
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
                <div className="title">좌우 </div>
                <div className="date">
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
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP" 
                    value={inputKp}
                    defaultValue={inputKp}
                    style={RANGEPICKERSTYLE} 
                    onKeyDown={(e)=>{ if(e.key==="Enter"){
                      setKP(e.target.value);
                    }}}
                    onChange={(e)=>{
                      const { value: inputValue } = e.target;
                      const reg = /^-?\d*(\.\d*)?$/;
                      if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
                        setInputKp(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
                {trackGeo.shapeDisplay} /
                R={trackGeo.direction} {trackGeo.radius} (C={trackGeo.cant}, S={trackGeo.slack})
              </div>
            </div>
      </div>
      <div className="contentBox" 
        style={{height:"calc(100% - 245px)", position:"relative"}} id="trackMapBox"
      >
        <div className="containerTitle">
          <div>검토구간</div>
          <div className="flex">
            <div className="modalButton highlight" onClick={()=>{
                      console.log("선로열람도 상세보기");
                      setRailmapOpen(true);
            }} >선로열람도 상세보기</div>
          </div>
        </div>
        <div className="componentBox">
          <div ref={containerRef} className="boxProto track" id="trackMapContainer">
          {/* {
            imgLoadArr.map( (img, i) => {
              return <img width={img.width * IMGSCALING} src={img.src}/>
            })
          } */}
          {
            (viewRailMap) ?
              <img alt="선로열람도" ref={imgRef} src={viewRailMap.url} onLoad={()=>{
                adjustPosition();
                /* setKPMarker(viewRailMap.position); */
                /* markerElement.style.left = `${result.position}px`;
                container.scrollLeft = result.position - (container.offsetWidth / 2); */ // km 위치가 컨테이너의 중앙에 오도록 스크롤 조정
              }} /> : null
          }
            <div className="guideLine" id="guideLine" style={{left:`${kpMarker}px`}}>
            </div>
          </div>
          <div className="dataContainer">
            {
              ( selectedPath.type === STRING_STATION ) ? 
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
                        <div className="td">{formatDateTime(new Date(rightRemaining.nextTimeToReplace))}</div>

                        {/* <div className="td">{formatDateTime(new Date(leftRemaining.firstMeasureTs))}</div>
                        <div className="td">{formatDateTime(new Date(leftRemaining.secondMeasureTs))}</div> */}
                        <div className="td">{formatDateTime(new Date(leftRemaining.zeroMeasureTs))}</div>
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
                        <div className="td">{formatDateTime(new Date(leftRemaining.nextTimeToReplace))}</div>

                        {/* <div className="td">{formatDateTime(new Date(leftRemaining.firstMeasureTs))}</div>
                        <div className="td">{formatDateTime(new Date(leftRemaining.secondMeasureTs))}</div> */}
                        <div className="td">{formatDateTime(new Date(leftRemaining.zeroMeasureTs))}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              : 
              ( selectedPath.type === STRING_PATH ) ?
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
                        <div key={i} className="tr">
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
                          <div className="td">{formatDateTime(new Date(remaining.leftRemaining.nextTimeToReplace))}</div>

                          {/* <div className="td">{formatDateTime(new Date(remaining.leftRemaining.firstMeasureTs))}</div>
                          <div className="td">{formatDateTime(new Date(remaining.leftRemaining.secondMeasureTs))}</div> */}
                          <div className="td">{formatDateTime(new Date(remaining.leftRemaining.zeroMeasureTs))}</div>
                        </div>
                        <div key={i} className="tr">
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
                          <div className="td">{formatDateTime(new Date(remaining.rightRemaining.nextTimeToReplace))}</div>

                          {/* <div className="td">{formatDateTime(new Date(remaining.rightRemaining.firstMeasureTs))}</div>
                          <div className="td">{formatDateTime(new Date(remaining.rightRemaining.secondMeasureTs))}</div> */}
                          <div className="td">{formatDateTime(new Date(remaining.rightRemaining.zeroMeasureTs))}</div>
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
                height : `${viewRailMap?.originalHeight}px`
              }}></div>
              {(viewRailMap) ? <img 
                ref={zoomimgRef} 
                alt="선로열람도" 
                src={viewRailMap.url} 
                onLoad={()=>{
                  console.log("zoom img onload");
                  zoomImgAdjustPosition();
                }}  
              /> : null}
            </div>
          </Box>
        </Modal> 
    </div>
  );
}

export default CumulativeThroughput;
