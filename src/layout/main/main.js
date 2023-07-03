import Login from "../../component/login/login";
import Title from "../../component/title/title";
import "./main.css";

function Main() {
  return (
    <div className="main">
      <div className="titleContainer">
        <Title />
      </div>
      <div className="content">
        <Login />
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default Main;
