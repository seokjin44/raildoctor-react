import "./title.css";
import RaildoctorLogo from "../../assets/logo.svg";
import UserInformation from "../userInformation/userInformation";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames"

function Title() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);


  return (
    <div className="titleBox">
        <div className="logo">
            <img src={RaildoctorLogo} />
        </div>
        <div className="menuList">
          <div className={ classnames("menu",{ active : location.pathname.indexOf("monitoring") > -1 }) } onClick={()=>{navigate("/monitoring");}}>선로모니터링</div>
          <div className={ classnames("menu",{ active : location.pathname.indexOf("wearMaintenance") > -1 }) } onClick={()=>{navigate("/wearMaintenance");}}>마모유지관리</div>
          <div className={ classnames("menu",{ active : location.pathname.indexOf("cumulativeThroughput") > -1 }) } onClick={()=>{navigate("/cumulativeThroughput",{});}} >누적통과톤수</div>
          <div className="menu">궤도틀림</div>
          <div className="menu">궤도거동계측 </div>
          <div className="menu">온/습도</div>
          <div className="menu">레일프로파일</div>
        </div>
        <div className="userInfo">
            <UserInformation userId={""}></UserInformation>
        </div>
    </div>
  );
}

export default Title;
