import React from "react";
import "./userInformation.css"
import UserIcon from "../../assets/user.svg";

class UserInformation extends React.Component {

  constructor( props ){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="userInfoBox">
        <div className="userPicture">
          <img src={UserIcon} alt="유저사진"/>
        </div>
        <div className="userDetail">
          <div className="userName">{"Admin"/* {this.props.userId} */}</div>
          <div className="lastLogin">Login : 2022/08/19 15:10:00</div>
        </div>
      </div>
    );
  }

}

export default UserInformation;