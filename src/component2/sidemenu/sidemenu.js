import "./sidemenu.css";
import { useEffect, useState } from "react";
import RaildoctorLogo from "../../assets/logo_color.png";
import UserIcon from "../../assets/icon/403024_avatar_boy_male_user_young_icon.png";
import ICTR from "../../assets/logo/ictr.jpg";
import SEOUL from "../../assets/logo/seoulmetro2.png";
import K_N from "../../assets/logo/k_n_railway.png";
import KORAIL from "../../assets/logo/korail.png";
import Arrow from "../../assets/icon/211689_right_arrow_icon.png";
import classnames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { STRING_ROUTE_GYEONGBU, STRING_ROUTE_INCHON, STRING_ROUTE_OSONG, STRING_ROUTE_SEOUL } from "../../constant";

function Sidemenu( props ) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectRoute, setSelectRoute] = useState(0);
  console.log(location);
  const [routeSelectOpen, setRouteSelectOpen] = useState(false);

  const dateFormat = ( date ) => {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
  
  useEffect( ()=> {
    let value = sessionStorage.getItem('route');
    console.log(value);
    if( !value || value === null || value === undefined ){
      sessionStorage.setItem('route', STRING_ROUTE_INCHON);
      setSelectRoute(STRING_ROUTE_INCHON);
    }else{
      setSelectRoute(value);
    }
  }, [])

  return (
    <div className="sideMenu">
      <div className="logo">
          <img src={RaildoctorLogo} />
      </div>
      <div className="user">
        <div className="userIcon">
          <img src={UserIcon} />
        </div>
        <div className="userName">{/* {(location.state?.id) ? location.state.id : "로그인해주세요"} */}Admin</div>
        <div className="lastLogin">{/* {(location.state?.id) ? dateFormat(new Date()) : ""} */}{dateFormat(new Date())}</div>
        <div className="route" onClick={()=>{setRouteSelectOpen(!routeSelectOpen)}}>
          {
            (selectRoute === STRING_ROUTE_INCHON) ? <><img alt="ICTR" className="routeLogo" src={ICTR} />인천 1호선<img alt="RIGHT" className="rightArrow" src={Arrow} /></> :
            (selectRoute === STRING_ROUTE_SEOUL) ? <><img alt="SEOUL" className="routeLogo" src={SEOUL} />서울 2호선<img alt="RIGHT" className="rightArrow" src={Arrow} /></> :
            (selectRoute === STRING_ROUTE_OSONG) ? <><img alt="K_N" className="routeLogo" src={K_N} />오송시험선<img alt="RIGHT" className="rightArrow" src={Arrow} /></> :
            (selectRoute === STRING_ROUTE_GYEONGBU) ? <><img alt="KORAIL" className="routeLogo" src={KORAIL} />KTX 경부고속선<img alt="RIGHT" className="rightArrow" src={Arrow} /></> : null
          }
          
        </div>
        {(routeSelectOpen) ? <div className="routeSelect">
          <div className="route" onClick={()=>{
            setSelectRoute(STRING_ROUTE_INCHON);
            sessionStorage.setItem('route', STRING_ROUTE_INCHON);
            window.location.reload();
          }} >
            <img alt="ICTR" className="routeLogo" src={ICTR} />인천 1호선
          </div>
          <div className="route" onClick={()=>{
            setSelectRoute(STRING_ROUTE_SEOUL)
            sessionStorage.setItem('route', STRING_ROUTE_SEOUL);
            window.location.reload();
          }}>
            <img alt="SEOUL" className="routeLogo" src={SEOUL} />서울 2호선
          </div>
          <div className="route" onClick={()=>{
            setSelectRoute(STRING_ROUTE_OSONG)
            sessionStorage.setItem('route', STRING_ROUTE_OSONG);
            window.location.reload();
          }}>
            <img alt="K_N" className="routeLogo" src={K_N}/> {/* <img className="routeLogo" src={K_R} /> */}오송시험선
          </div>
          <div className="route" onClick={()=>{
            setSelectRoute(STRING_ROUTE_GYEONGBU);
            sessionStorage.setItem('route', STRING_ROUTE_GYEONGBU);
            window.location.reload();
          }}>
            <img alt="KORAIL" className="routeLogo" src={KORAIL} />KTX 경부고속선
          </div>
        </div> : null}
      </div>

      <div className="menuList">
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("monitoring") > -1 }) } 
              onClick={()=>{navigate("/monitoring");}}>
            선로모니터링
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("cumulativeThroughput") > -1 }) } onClick={()=>{navigate("/cumulativeThroughput",{});}} >
            누적통과톤수
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("wearMaintenance") > -1 }) } onClick={()=>{navigate("/wearMaintenance");}}>
            마모유지관리
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("trackDeviation") > -1 }) } onClick={()=>{navigate("/trackDeviation",{});}} >
            궤도틀림
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("trackGeometryMeasurement") > -1 }) } onClick={()=>{navigate("/trackGeometryMeasurement",{});}} >
            궤도거동계측 
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("MeasuringTemperatureHumidity") > -1 }) } onClick={()=>{navigate("/MeasuringTemperatureHumidity",{});}} >
            온/습도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railProfile") > -1 }) } onClick={()=>{navigate("/railProfile",{});}} >
            레일프로파일
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railTrackAlignment") > -1 }) } onClick={()=>{navigate("/railTrackAlignment",{});}} >
            레일직진도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railRoughness") > -1 }) } onClick={()=>{navigate("/railRoughness",{});}} >
            레일조도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("lwd") > -1 }) } onClick={()=>{navigate("/lwd",{});}} >
            LWD
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("dataUpload") > -1 }) } onClick={()=>{navigate("/dataUpload",{});}} >
            데이터관리
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidemenu;
