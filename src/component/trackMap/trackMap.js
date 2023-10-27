import React, { useEffect, useRef, useState } from "react";
import { Box, Modal } from "@mui/material";
import "./trackMap.css";
import { BOXSTYLE } from "../../constant";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
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

function TrackMap( props ) {
  const [imgLoadArr, setImgLoadArr] = useState([]);

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
          left: left - (container.clientWidth/2),
          behavior: "smooth",
        });
        return;
      }else{
        accWidth = accWidth + (img.width * IMGSCALING);
      }
    }
  }

  useEffect(() => {
    readyImg(); 
  }, []);

  useEffect(() => {
    console.log(props.kp);
    findKP(props.kp);
  }, [props.kp]);

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

  return (
    <div className="trackMapContainer" id="trackMapContainer">
      {
        imgLoadArr.map( (img, i) => {
          return <img width={img.width * IMGSCALING} src={img.src}/>
        })
      }
      <Modal
        open={props.open}
        onClose={(e)=>{props.popupClose(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />선로열람도 상세보기</div>
          <div className="railMapContainer">
            {/* <img src={IncheonTrackImg} /> */}
          </div>
        </Box>
      </Modal>     
    </div>
  );
}

export default TrackMap;