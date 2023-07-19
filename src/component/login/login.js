import React from "react";
import Title from "../title/title";
import "./login.css"
import Modal from "../Modal/Modal";
import ExplainIcon from "../../assets/8725674_comment_info_alt_icon (1).svg";
import { useNavigate } from "react-router-dom";
import RaildoctorLogo from "../../assets/logo_color.png";

function Login( props ) {
  const navigate = useNavigate();
  const login = (e) => {
    console.log("login");
    let id = document.getElementById("id").value;
    let password = document.getElementById("password").value;

    for( let member of props.memberList ) {
      if( member.memberID === id && member.memberPW === password ) {
        sessionStorage.setItem("user", id);
        navigate("/routeSelection", {state:{id:id}});
        return;
      }
    };
    
    alert("ID/PW 다시확인해주세요.");

  }

  return (
  <div className="loginConatiner">
    <div className="logo">
      <img src={RaildoctorLogo} />
    </div>
    <div className="containerBackground">
      <div id="loginContainer">
        <div id="greetings">
          <div id="greetingsMain">Welcome Back !</div>
          <div id="greetingsSub">Sign in to continue to Veltrix</div>
        </div>
        <div id="login">
          <div className="line subject">Username</div>
          <div className="line"><input className="loginInput" id="id" placeholder="Enter username" 
                onKeyUp={(e)=>{ if(e.key === "Enter" ){ document.getElementById("password").focus() } }} /></div>
          <div className="line subject">Password</div>
          <div className="line"><input type="password" className="loginInput" id="password" placeholder="Enter password"
                onKeyUp={(e)=>{ if(e.key === "Enter" ){ login() } }} 
              /></div>
          <div className="line flexEnd">
            <div className="remeberMe">
              <div className="checkBox MR5"></div>
              Remember me
            </div>
            <button className="loginButton" onClick={(e)=>{login(e)}}>Log in</button>
          </div>
          <div className="line FS10 ALIGN_TOP TA_LEFT COL_P">
            <img className="MR5" width={15} src={ExplainIcon} /> 계정추가 및 비밀번호 문의는 관리자에게 문의하세요.
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login;