import { useNavigate } from "react-router-dom";
import "./routeSelection.css";
import { ROUTE_INCHEON_1, ROUTE_KTX_EXPRESS, ROUTE_OSONG_TEST, ROUTE_SEOUL_2 } from "../../constant";
import RaildoctorLogo from "../../assets/logo_color.png";

function RouteSelection( props ) {
  const navigate = useNavigate();
  const routeSelect = ( routeNumber ) => {
    navigate("/monitoring",{
      state : {
        routeNumber : routeNumber
      }
    });
  }

  return (
    <div className="routeSelection" >
      <div className="logo">
        <img src={RaildoctorLogo} />
      </div>
      <div className="routeLine">
        <div className="route img1" onClick={()=>{ routeSelect( ROUTE_INCHEON_1 ) }} >
            <div className="text">인천 1호선</div>
          </div>
        <div className="route img2" onClick={()=>{ routeSelect( ROUTE_SEOUL_2 ) }}>
            <div className="text">서울 2호선</div>
          </div>
      </div>
      <div className="routeLine">
        <div className="route img3" onClick={()=>{ routeSelect( ROUTE_OSONG_TEST ) }}>
          <div className="text">오송시험선</div>
        </div>
        <div className="route img4" onClick={()=>{ routeSelect( ROUTE_KTX_EXPRESS ) }}>
          <div className="text">KTX 경부고속선</div>
        </div>
      </div>
    </div>
  );
}

export default RouteSelection;
