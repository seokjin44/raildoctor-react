import "./cumulativeThroughput.css";
import 'dayjs/locale/ko';
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useState } from "react";
import { DatePicker, Input } from 'antd';
import { Radio } from 'antd';
import { RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE } from "../../constant";
import test1Img from "../../assets/trackTest/1.jpg";
import test2Img from "../../assets/trackTest/2.jpg";
import test3Img from "../../assets/trackTest/3.jpg";
import test4Img from "../../assets/trackTest/4.jpg";
import test5Img from "../../assets/trackTest/5.jpg";
import test6Img from "../../assets/trackTest/6.jpg";
import test7Img from "../../assets/trackTest/7.jpg";
import test8Img from "../../assets/trackTest/8.jpg";
import test9Img from "../../assets/trackTest/9.jpg";
import test10Img from "../../assets/trackTest/10.jpg";
import test11Img from "../../assets/trackTest/11.jpg";
import test12Img from "../../assets/trackTest/12.jpg";
import test13Img from "../../assets/trackTest/13.jpg";
import test14Img from "../../assets/trackTest/14.jpg";
import test15Img from "../../assets/trackTest/15.jpg";
import test16Img from "../../assets/trackTest/16.jpg";
import test17Img from "../../assets/trackTest/17.jpg";
import test18Img from "../../assets/trackTest/18.jpg";
import test19Img from "../../assets/trackTest/19.jpg";
import test20Img from "../../assets/trackTest/20.jpg";
import test21Img from "../../assets/trackTest/21.jpg";
import test22Img from "../../assets/trackTest/22.jpg";
import test23Img from "../../assets/trackTest/23.jpg";
import test24Img from "../../assets/trackTest/24.jpg";
import test25Img from "../../assets/trackTest/25.jpg";
import test26Img from "../../assets/trackTest/26.jpg";
import test27Img from "../../assets/trackTest/27.jpg";
import test28Img from "../../assets/trackTest/28.jpg";
import test29Img from "../../assets/trackTest/29.jpg"; 
import classNames from "classnames";

let imgArr = [
  { url : test1Img, start : 0, end : 900 } ,
  { url : test2Img, start : 901, end : 2400 }  ,
  { url : test3Img, start : 2401, end : 3500 }  ,
  { url : test4Img, start : 3501, end : 4600 }  ,
  { url : test5Img, start : 4601, end : 5500 }  ,
  { url : test6Img, start : 5501, end : 6400 }  ,
  { url : test7Img, start : 6401, end : 7800 }  ,
  { url : test8Img, start : 7801, end : 8800 }  ,
  { url : test9Img, start : 8801, end : 9900 }  ,
  { url : test10Img, start : 9901, end : 10800 } ,
  { url : test11Img, start : 10801, end : 11700 } ,
  { url : test12Img, start : 11701, end : 12800 } ,
  { url : test13Img, start : 12801, end : 14000 } ,
  { url : test14Img, start : 14001, end : 15400 } ,
  { url : test15Img, start : 15401, end : 16400 } ,
  { url : test16Img, start : 16401, end : 17200 } ,
  { url : test17Img, start : 17201, end : 18000 } ,
  { url : test18Img, start : 18001, end : 18800 } ,
  { url : test19Img, start : 18801, end : 19900 } ,
  { url : test20Img, start : 19901, end : 20800 } ,
  { url : test21Img, start : 20801, end : 21900 } ,
  { url : test22Img, start : 21901, end : 22900 } ,
  { url : test23Img, start : 22901, end : 24500 } ,
  { url : test24Img, start : 24501, end : 25300 } ,
  { url : test25Img, start : 25301, end : 26700 } ,
  { url : test26Img, start : 26701, end : 27700 } ,
  { url : test27Img, start : 27701, end : 28600 } ,
  { url : test28Img, start : 28601, end : 29400 } ,
  { url : test29Img, start : 29401, end : 30300 } ,
];

let imgTotalWidth = 0;
const IMGSCALING = 0.2;

function CumulativeThroughput( props ) {
  const [imgLoadArr, setImgLoadArr] = useState([]);
  const [kp, setKP] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const [isGuideLineDragging, setIsGuideLineDragging ] = useState(false);
  const [guideLineLeft, setGuideLineLeft] = useState(295);
  const [moveStartX, setMoveStartX] = useState(0);
  const [guideLineOver, setGuideLineOver] = useState(false);

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
      if( accWidth > container.scrollLeft ){
        accWidth = accWidth - nextImgWidth;
        let imgWidth = (img.width* IMGSCALING);
        let dataPosition = img.start + (guideLineLeft / imgWidth) * (img.end - img.start);
        console.log(dataPosition);
        setKP( parseInt(dataPosition) );
        return;
      }
    }    
  }

  useEffect(() => {
    readyImg();
  }, []);

  useEffect(() => {
    if(!isGuideLineDragging){
      findKP(kp);
    }
  }, [kp]);

  const readyImg = async () => {
    console.log("readyImg");
    let imgLoadArr_ = [];
    for( let img of imgArr ){
      let img_ = await loadImg(img.url);
      img_['start'] = img.start;
      img_['end'] = img.end;
      imgLoadArr_.push(img_);
    }
    setImgLoadArr(imgLoadArr_);
  }

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
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">검토일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="date">
                  <Radio.Group style={RADIO_STYLE} >
                    <Radio value={1}>상선</Radio>
                    <Radio value={2}>하선</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP" defaultValue={kp}
                    value={kp}
                    style={RANGEPICKERSTYLE} onChange={(e)=>{ setKP(e.target.value) }}
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
      >
        <div className="containerTitle">
          <div>검토구간</div>
        </div>
        <div className="componentBox">
          <div className="boxProto track" id="trackMapContainer">
          {
            imgLoadArr.map( (img, i) => {
              return <img width={img.width * IMGSCALING} src={img.src}/>
            })
          }
          </div>
          <div className="guideLine" id="guideLine" style={{left : guideLineLeft + "px"}}
            onMouseDown={(e)=>{
              setIsGuideLineDragging(true);
              setMoveStartX(e.clientX);
              console.log(e.clientX);
            }}
            onMouseUp={()=>{
              setIsGuideLineDragging(false);
            }}
          >
            <div className="dataContainer">
              <div className="dataLine">
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
              </div>
              <div className="dataLine">
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
              </div>
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">좌우</div>
                      <div className="td">시점</div>
                      <div className="td">종점</div>
                      <div className="td">연장</div>
                      <div className="td">교체</div>
                      <div className="td">계측</div>
                      <div className="td">누적</div>
                      <div className="td">일평균</div>
                      <div className="td">잔여톤수</div>
                      <div className="td">갱환예상</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">우</div>
                      <div className="td">117</div>
                      <div className="td">669</div>
                      <div className="td">552</div>
                      <div className="td">2007-03-16</div>
                      <div className="td">2021-12-31</div>
                      <div className="td">280,562,738</div>
                      <div className="td">41,915</div>
                      <div className="td">-</div>
                      <div className="td">2042-11-12</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">좌우</div>
                      <div className="td">시점</div>
                      <div className="td">종점</div>
                      <div className="td">연장</div>
                      <div className="td">교체</div>
                      <div className="td">계측</div>
                      <div className="td">누적</div>
                      <div className="td">일평균</div>
                      <div className="td">잔여톤수</div>
                      <div className="td">갱환예상</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">좌</div>
                      <div className="td">117</div>
                      <div className="td">669</div>
                      <div className="td">552</div>
                      <div className="td">2007-03-16</div>
                      <div className="td">2021-12-31</div>
                      <div className="td">280,562,738</div>
                      <div className="td">41,915</div>
                      <div className="td">-</div>
                      <div className="td">2042-11-12</div>
                    </div>
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
