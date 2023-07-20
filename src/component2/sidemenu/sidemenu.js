import "./sidemenu.css";
import { useEffect, useState } from "react";
import RaildoctorLogo from "../../assets/logo_color.png";
import UserIcon from "../../assets/icon/403024_avatar_boy_male_user_young_icon.png";
import ICTR from "../../assets/logo/ictr.jpg"
import SEOUL from "../../assets/logo/seoulmetro2.png"

import K_N from "../../assets/logo/k_n_railway.png"
import K_R from "../../assets/logo/k_r_r_institute.png"
import KORAIL from "../../assets/logo/korail.png"

import Arrow from "../../assets/icon/211689_right_arrow_icon.png";
import classnames from "classnames"
import { useLocation, useNavigate } from "react-router-dom";
import MonitoringIcon from "../../assets/icon/menu/4900850_analytics_chart_marketing_monitoring_search_icon.png";
import CumulativeThroughputIcon from "../../assets/icon/menu/9044314_drill_through_icon.png";
import WearMaintenanceIcon from "../../assets/icon/menu/8156570_equipment_maintenance_screwdriver_tools_wrench_icon.png";
import TrackDeviationIcon from "../../assets/icon/menu/2638283_arrows_dirrection_intersection_road_sign_icon.png";
import TrackGeometryMeasurementIcon from "../../assets/icon/menu/7291533_compass_geometry_drawing_school_office_icon.png";
import MeasuringTemperatureHumidityIcon from "../../assets/icon/menu/7276575_temperature_thermometer_weather_icon.png";
import RailProfileIcon from "../../assets/icon/menu/103285_rail_aboveground_icon.png";
import RailRoughnessIcon from "../../assets/icon/menu/134168_transportation_train_rail_icon.png";
import RailTrackAlignmentIcon from "../../assets/icon/menu/8665879_stairs_staircase_icon.png";
import DataIcon from "../../assets/icon/menu/2203509_cloud_data_online_storage_icon.png";

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
  }, [location])

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
          <img className="routeLogo" src={ICTR} />인천 1호선<img className="rightArrow" src={Arrow} />
        </div>
        {(routeSelectOpen) ? <div className="routeSelect">
          <div className="route">
            <img className="routeLogo" src={ICTR} />인천 1호선
          </div>
          <div className="route">
            <img className="routeLogo" src={SEOUL} />서울 2호선
          </div>
          <div className="route">
            <img className="routeLogo" src={K_N} /> {/* <img className="routeLogo" src={K_R} /> */}오송시험선
          </div>
          <div className="route">
            <img className="routeLogo" src={KORAIL} />KTX 경부고속선
          </div>
        </div> : null}
      </div>

      <div className="menuList">
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("monitoring") > -1 }) } 
              onClick={()=>{navigate("/monitoring");}}>
            {/* <div className="icon"><img src={MonitoringIcon} /></div> */}선로모니터링
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("cumulativeThroughput") > -1 }) } onClick={()=>{navigate("/cumulativeThroughput",{});}} >
            {/* <div className="icon"><img src={CumulativeThroughputIcon} /></div> */}누적통과톤수
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("wearMaintenance") > -1 }) } onClick={()=>{navigate("/wearMaintenance");}}>
            {/* <div className="icon"><img src={WearMaintenanceIcon} /></div> */}마모유지관리
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("trackDeviation") > -1 }) } onClick={()=>{navigate("/trackDeviation",{});}} >
            {/* <div className="icon"><img src={TrackDeviationIcon} /></div> */}궤도틀림
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("trackGeometryMeasurement") > -1 }) } onClick={()=>{navigate("/trackGeometryMeasurement",{});}} >
            {/* <div className="icon"><img src={TrackGeometryMeasurementIcon} /></div> */}궤도거동계측 
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("MeasuringTemperatureHumidity") > -1 }) } onClick={()=>{navigate("/MeasuringTemperatureHumidity",{});}} >
            {/* <div className="icon"><img src={MeasuringTemperatureHumidityIcon} /></div> */}온/습도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railProfile") > -1 }) } onClick={()=>{navigate("/railProfile",{});}} >
          {/* <div className="icon"><img src={RailProfileIcon} /></div> */}레일프로파일
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railRoughness") > -1 }) } onClick={()=>{navigate("/railRoughness",{});}} >
          {/* <div className="icon"><img src={RailRoughnessIcon} /></div> */}레일직진도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("railTrackAlignment") > -1 }) } onClick={()=>{navigate("/railTrackAlignment",{});}} >
          {/* <div className="icon"><img src={RailTrackAlignmentIcon} /></div> */} 레일조도
          </div>
        </div>
        <div className="menuBox">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("dataUpload") > -1 }) } onClick={()=>{navigate("/dataUpload",{});}} >
            {/* <div className="icon"><img src={DataIcon} /></div> */}데이터관리
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidemenu;
