import "./title.css";
import RaildoctorLogo from "../../assets/logo.svg";
import UserInformation from "../userInformation/userInformation";

function Title() {
  return (
    <div className="titleBox">
        <div className="logo">
            <img src={RaildoctorLogo} />
        </div>
        <div className="menuList"></div>
        <div className="userInfo">
            <UserInformation userId={""}></UserInformation>
        </div>
    </div>
  );
}

export default Title;
