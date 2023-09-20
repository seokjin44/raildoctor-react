import React, { useState } from "react";
import "./imgSlider.css";

function ImgSlider( props ) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === props.imgUrlList.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? props.imgUrlList.length - 1 : current - 1);
  };
  
  const imgCheck = ( imgUrlList ) => {
    if(!imgUrlList || imgUrlList.length < 1){
      return (<div className="slider">
        <div>이미지없음</div>
      </div>
      );
    }else{
      return (
        <div className="slider">
          <div className="sliderBtn left" onClick={prevSlide}></div>
          {props.imgUrlList.map((image, index) => (
            <div className={index === current ? 'slide active' : 'slide'} key={index}>
              {index === current && <img src={image} alt={`image ${index}`} />}
            </div>
          ))}
          <div className="sliderBtn right" onClick={nextSlide}></div>
        </div>
      );
    }
  }

  return (
    <>
      {imgCheck(props.imgUrlList)}
    </>
  );
}

export default ImgSlider;