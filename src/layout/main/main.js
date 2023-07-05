import Title from "../../component/title/title";
import "./main.css";
import { BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate,
} from 'react-router-dom';
import Login from "../../component/login/login";
import RouteSelection from "../routeSelection/routeSelection";

const ProtectedRoute = ({ user, children }) => {
  const isAuth = () => {
    console.log("isAuth");
    if( sessionStorage.getItem("user") === null ){
      return false;
    }else{
      return true;
    }
  }
  if (!isAuth()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function Main( props ) {

  return (
    <Router >
      <div className="main">
        <div className="titleContainer">
          <Title />
        </div>
        <div className="content">
          <Routes>
              <Route path="/" element={<ProtectedRoute>
                <Navigate to="/routeSelection" replace />
              </ProtectedRoute>} />
              <Route path="/routeSelection" element={<ProtectedRoute><RouteSelection/></ProtectedRoute>} />
              <Route path="/login" element={<Login memberList={props.memberList} />} />
          </Routes> 
        </div>
        <div className="footer"></div>
      </div>
    </Router>
  );
}

export default Main;
