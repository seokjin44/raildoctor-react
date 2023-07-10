import Title from "../../component/title/title";
import "./main.css";
import { BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Login from "../../component/login/login";
import RouteSelection from "../routeSelection/routeSelection";
import { useState } from "react";
import Monitoring from "../monitoring/monitoring";
import CumulativeThroughput from "../cumulativeThroughput/cumulativeThroughput";
import WearMaintenance from "../wearMaintenance/wearMaintenance";
import TrackGeometryMeasurement from "../trackGeometryMeasurement/trackGeometryMeasurement";
import TrackDeviation from "../trackDeviation/trackDeviation";
import MeasuringTemperatureHumidity from "../measuringTemperatureHumidity/measuringTemperatureHumidity";

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
  const [selectRoute, setSelectRoute] = useState(0);

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
              <Route path="/routeSelection" element={<ProtectedRoute>
                <RouteSelection />
              </ProtectedRoute>} />
              <Route path="/monitoring" element={<ProtectedRoute><Monitoring/></ProtectedRoute>} />
              <Route path="/wearMaintenance" element={<ProtectedRoute><WearMaintenance/></ProtectedRoute>} />
              <Route path="/cumulativeThroughput" element={<ProtectedRoute><CumulativeThroughput/></ProtectedRoute>} />
              <Route path="/trackGeometryMeasurement" element={<ProtectedRoute><TrackGeometryMeasurement/></ProtectedRoute>} />
              <Route path="/trackDeviation" element={<ProtectedRoute><TrackDeviation/></ProtectedRoute>} />

              <Route path="/measuringTemperatureHumidity" element={<ProtectedRoute><MeasuringTemperatureHumidity/></ProtectedRoute>} />

              <Route path="/login" element={<Login memberList={props.memberList} />} />
          </Routes> 
        </div>
        <div className="footer"></div>
      </div>
    </Router>
  );
}

export default Main;
