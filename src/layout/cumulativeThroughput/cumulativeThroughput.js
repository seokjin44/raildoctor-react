import "./cumulativeThroughput.css";
import 'dayjs/locale/ko';
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useRef, useState } from "react";
import { DatePicker, Input } from 'antd';
import { Radio } from 'antd';
import { RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_TRACK_DIR_LEFT, STRING_TRACK_DIR_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT } from "../../constant";
import classNames from "classnames";
import axios from 'axios';
import qs from 'qs';
import { formatDateTime } from "../../util";

let imgTotalWidth = 0;
const IMGSCALING = 0.2;
let pictureList = [];
function CumulativeThroughput( props ) {
  const [imgLoadArr, setImgLoadArr] = useState([]);
  const [kp, setKP] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const [isGuideLineDragging, setIsGuideLineDragging ] = useState(false);
  const [guideLineLeft, setGuideLineLeft] = useState(295);
  const [moveStartX, setMoveStartX] = useState(0);
  const [guideLineOver, setGuideLineOver] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [kpMarker, setKPMarker] = useState(0);
  const [viewRailMap, setViewRailMap] = useState(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [selectDir, setSelectDir] = useState(STRING_TRACK_DIR_LEFT);
  const [accumulateweightData, setAccumulateweightData] = useState({});

  const [remainingCriteria, setRemainingCriteria] = useState(0);
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});

  const loadImg = async (url) => {
    return new Promise((resolve, reject)=>{
      let img = new Image();
      img.src = url;
      img.onload = function() {
        imgTotalWidth += imgTotalWidth + (img.width * IMGSCALING);
        resolve(img);
      };
    })
  }
  
  const findKP = (kp) => {
    let accWidth = 0;
    for( let img of imgLoadArr ){
      if( img.start <= kp && img.end >= kp ){
        let range = img.end - img.start;
        let ratio = (img.width* IMGSCALING) / range;
        let pos = kp - img.start;
        let left = (ratio * pos) + accWidth;

        let container = document.getElementById('trackMapContainer');
        container.scroll({
          top: 0,
          left: left - (guideLineLeft),
          behavior: "smooth",
        });
        return;
      }else{
        accWidth = accWidth + (img.width * IMGSCALING);
      }
    }
  }

  const guideLIneFindKP = () => {
    let container = document.getElementById('trackMapContainer');
    console.log(container.scrollLeft);
    let accWidth = 0;
    for( let img of imgLoadArr ){
      let nextImgWidth = img.width* IMGSCALING;
      accWidth = accWidth + nextImgWidth;
      if( accWidth > (container.scrollLeft + guideLineLeft) ){
        accWidth = accWidth - nextImgWidth;
        let pos = (container.scrollLeft + guideLineLeft) - accWidth;
        let imgWidth = (img.width * IMGSCALING);
        let dataPosition = img.start + (pos / imgWidth) * (img.end - img.start);
        setKP( parseInt(dataPosition) );
        return;
      }
    }    
  }

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
  }, []);

  useEffect(() => {
    if(!isGuideLineDragging){
      findKP(kp);
    }
  }, [kp]);

  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  return (
    <div className="cumulativeThroughput" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
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
                    /* defaultValue={kp}
                    value={kp} */
                    style={RANGEPICKERSTYLE} 
                    onKeyDown={(e)=>{ if(e.key==="Enter"){
                      setKP(e.target.value) 
                      let find = findPictureAndPosition( parseInt(e.target.value) / 1000);
                      setViewRailMap(find);
                      adjustPosition();

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
                      console.log((e.target.value / 1000));
                      let param  = {
                        railroad_name : "인천 1호선",
                        measure_ts : selectDate.toISOString(),
                        rail_track : track_,
                        kp : (e.target.value / 1000)
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
                    }}}
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
      <div className="contentBox" 
        style={{height:"calc(100% - 245px)", position:"relative"}} id="trackMapBox"
        onMouseMove={(e)=>{
          if(isGuideLineDragging){
            const parent = document.getElementById("trackMapBox");
            const parentRect = parent.getBoundingClientRect();
            const x = e.clientX - parentRect.left;
            setGuideLineLeft(x);
            guideLIneFindKP();
          }
        }}
        onMouseUp={()=>{
          if( isGuideLineDragging ){
            setIsGuideLineDragging(false);
          }
        }}
      >
        <div className="containerTitle">
          <div>검토구간</div>
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
              <img ref={imgRef} src={viewRailMap.url} onLoad={()=>{
                adjustPosition();
                /* setKPMarker(viewRailMap.position); */
                /* markerElement.style.left = `${result.position}px`;
                container.scrollLeft = result.position - (container.offsetWidth / 2); */ // km 위치가 컨테이너의 중앙에 오도록 스크롤 조정
              }} /> : null
          }
            <div className="guideLine" id="guideLine" style={{left:`${kpMarker}px`}}
              onMouseDown={(e)=>{
                setIsGuideLineDragging(true);
                setMoveStartX(e.clientX);
                console.log(e.clientX);
              }}
              onMouseUp={()=>{
                setIsGuideLineDragging(false);
              }}
            >
            </div>
          </div>
          <div className="dataContainer">
            {/* <div className="dataLine">
              <div className="table">
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td">조회일자</div>
                    <div className="td">좌레일</div>
                    <div className="td">우레일</div>
                  </div>
                </div>
                <div className="tableBody">
                  <div className="tr">
                    <div className="td">2023.01.01</div>
                    <div className="td">414,939,971</div>
                    <div className="td">414,939,971</div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div className="dataLine">
              <div className="table">
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td">검토일자</div>
                    <div className="td">좌레일</div>
                    <div className="td">우레일</div>
                  </div>
                </div>
                <div className="tableBody">
                  <div className="tr">
                    <div className="td">2023.01.01</div>
                    <div className="td">414,939,971</div>
                    <div className="td">414,939,971</div>
                  </div>
                </div>
              </div>
            </div> */}
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
                    <div className="td">잔여톤수</div>
                    <div className="td">갱환예상</div>
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
                    <div className="td">{remainingCriteria}</div>
                    <div className="td">{rightRemaining.accumulateweight}</div>
                    {/* <div className="td">41,915</div> */}
                    <div className="td">{rightRemaining.remainingWeight}</div>
                    <div className="td">{formatDateTime(new Date(rightRemaining.nextTimeToReplace))}</div>
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
                    <div className="td">잔여톤수</div>
                    <div className="td">갱환예상</div>
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
                    <div className="td">{remainingCriteria}</div>
                    <div className="td">{leftRemaining.accumulateweight}</div>
                    {/* <div className="td">41,915</div> */}
                    <div className="td">{leftRemaining.remainingWeight}</div>
                    <div className="td">{formatDateTime(new Date(leftRemaining.nextTimeToReplace))}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CumulativeThroughput;
