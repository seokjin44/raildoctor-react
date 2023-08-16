import Title from "../../component/title/title";
import "./main2.css";
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
import RailProfile from "../railProfile/railProfile";
import RailRoughness from "../railRoughness/railRoughness";
import RailTrackAlignment from "../railTrackAlignment/railTrackAlignment";
import DataUpload from "../dataUpload/dataUpload";
import Sidemenu from "../../component2/sidemenu/sidemenu";

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

function Main2( props ) {
  const [selectRoute, setSelectRoute] = useState(0);

  return (
    <Router >
      <div className="main2">
        <div className="sideMenuContainer">
          <Sidemenu></Sidemenu>
        </div>
        <div className="content">
          <div className="topBar"></div>
          <Routes>
              <Route path="/" element={<ProtectedRoute>
                <Navigate to="/monitoring" replace />
              </ProtectedRoute>} />
              {/* <Route path="/routeSelection" element={<ProtectedRoute>
                <RouteSelection />
              </ProtectedRoute>} /> */}
              <Route path="/monitoring" element={<ProtectedRoute><Monitoring/></ProtectedRoute>} />
              <Route path="/wearMaintenance" element={<ProtectedRoute><WearMaintenance/></ProtectedRoute>} />
              <Route path="/cumulativeThroughput" element={<ProtectedRoute><CumulativeThroughput/></ProtectedRoute>} />
              <Route path="/trackGeometryMeasurement" element={<ProtectedRoute><TrackGeometryMeasurement/></ProtectedRoute>} />
              <Route path="/trackDeviation" element={<ProtectedRoute><TrackDeviation/></ProtectedRoute>} />
              <Route path="/measuringTemperatureHumidity" element={<ProtectedRoute><MeasuringTemperatureHumidity/></ProtectedRoute>} />

              <Route path="/railProfile" element={<ProtectedRoute><RailProfile/></ProtectedRoute>} />
              <Route path="/railRoughness" element={<ProtectedRoute><RailRoughness/></ProtectedRoute>} />
              <Route path="/railTrackAlignment" element={<ProtectedRoute><RailTrackAlignment/></ProtectedRoute>} />
              <Route path="/login" element={<Login memberList={props.memberList} />} />

              <Route path="/dataUpload" element={<ProtectedRoute><DataUpload/></ProtectedRoute>} />
          </Routes> 
        </div>
      </div>
    </Router>
  );
}

export default Main2;
