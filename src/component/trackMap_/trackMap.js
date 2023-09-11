/* canvas 버전 */

import React, { useEffect, useRef, useState } from "react";
import { Box, Modal } from "@mui/material";
/* import IncheonTrackImg from "../../assets/track/incheon_track2.png"; */
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
  test1Img ,
  test2Img ,
  test3Img ,
  test4Img ,
  test5Img ,
  test6Img ,
  test7Img ,
  test8Img ,
  test9Img ,
  test10Img,
  test11Img,
  test12Img,
  test13Img,
  test14Img,
  test15Img,
  test16Img,
  test17Img,
  test18Img,
  test19Img,
  test20Img,
  test21Img,
  test22Img,
  test23Img,
  test24Img,
  test25Img,
  test26Img,
  test27Img,
  test28Img,
  test29Img,
];

let imgTotalWidth = 0;
const IMGSCALING = 0.2;

function TrackMap( props ) {
  const trackDetailCanvasRef = useRef(null);
  const [trackDetailPosition, setTrackDetailPosition] = useState({x: 0, y: 0});
  const [trackDetailDragging, setTrackDetailDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [scale, setScale] = useState(1);
  const [imgLoadArr, setImgLoadArr] = useState([]);

  const trackDetailDrawImage = async () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    /* img.src= IncheonTrackImg; */

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.save(); // Save the current state of the context
    ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
    console.log(trackDetailPosition.x);
    ctx.scale(1, 1); // Apply scaling 
    /* console.log(trackDetailPosition.x); */
    let drawX = 0;
    for( let img of imgLoadArr ){
      drawX = drawImg(canvas, ctx, drawX, img);
    }
    ctx.restore();
  }

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

  const drawImg = (canvas, ctx, x, img) => {
    let newWidth = (img.width/img.height) * canvas.height;
    let newHeight = canvas.height;
    ctx.drawImage(img, 0, 0, img.width, img.height, x, 0, newWidth * IMGSCALING, newHeight * IMGSCALING); 
    x = x + (newWidth * 0.2);
    return x;
  }

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

      const newPosX = trackDetailPosition.x + newPos.x - lastPos.x;
      const newWidth = (imgTotalWidth * IMGSCALING) * scale;
      
      // Check if the new position is outside the canvas
      if (newPosX <= 0 && newPosX + newWidth >= canvas.width) {
        setTrackDetailPosition({
          x: newPosX,
          y: trackDetailPosition.y
        });
      }
      setLastPos(newPos);
    }
  };

  useEffect(() => {
    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;
    readyImg(); 
  }, []);

  const readyImg = async () => {
    console.log("readyImg");
    let imgLoadArr_ = [];
    for( let i of imgArr ){
      console.log(i);
      let img = await loadImg(i);
      imgLoadArr_.push(img);
    }
    setImgLoadArr(imgLoadArr_);
  }

  useEffect(() => {
    trackDetailDrawImage();
  }, [trackDetailPosition, scale]);

  return (
    <div className="trackDetailContainer" id="trackDetailContainer">
      <canvas id="trackDetailCanvas"
          ref={trackDetailCanvasRef}
          onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
          onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
          onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
      />
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