import React from "react";
import Title from "../title/title";
import "./login.css"
import Modal from "../Modal/Modal";
import ExplainIcon from "../../assets/8725674_comment_info_alt_icon (1).svg";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  setCookie = (name, value, options={}) => {
    /*
    options = {
      path: '/',
      // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
      ...options
    };
    */
    
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
  }

  login = (e) => {
    let id = document.getElementById("id").value;
    let password = document.getElementById("password").value;

    if(id !== "admin" || password !== "admin") {
      alert("ID / 패스워드를 확인해주세요.");
      return;
    }

    this.setCookie("userId", id);
    window.location.replace("/");
  }

  

  render() {
    return (
      <div className="containerBackground">
        <div id="loginContainer">
          <div id="greetings">
            <div id="greetingsMain">Welcome Back !</div>
            <div id="greetingsSub">Sign in to continue to Veltrix</div>
          </div>
          <div id="login">
            <div className="line subject">Username</div>
            <div className="line"><input className="loginInput" id="id" placeholder="Enter username"/></div>
            <div className="line subject">Password</div>
            <div className="line"><input type="password" className="loginInput" id="password" placeholder="Enter password"/></div>
            <div className="line flexEnd">
              <div className="remeberMe">
                <div className="checkBox MR5"></div>
                Remember me
              </div>
              <button className="loginButton" onClick={this.login}>Log in</button>
            </div>
            <div className="line FS10 ALIGN_TOP TA_LEFT COL_P">
              <img className="MR5" width={15} src={ExplainIcon} /> 계정추가 및 비밀번호 문의는 관리자에게 문의하세요.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;