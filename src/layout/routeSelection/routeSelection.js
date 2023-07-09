import { useNavigate } from "react-router-dom";
import "./routeSelection.css";
import { ROUTE_INCHEON_1, ROUTE_KTX_EXPRESS, ROUTE_OSONG_TEST, ROUTE_SEOUL_2 } from "../../constant";

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
      <div className="routeLine">
        <div className="route img1" 
          onClick={()=>{ routeSelect( ROUTE_INCHEON_1 ) }} >인천 1호선</div>
        <div className="route img2" 
          onClick={()=>{ routeSelect( ROUTE_SEOUL_2 ) }}>서울 2호선</div>
      </div>
      <div className="routeLine">
        <div className="route img3"
        onClick={()=>{ routeSelect( ROUTE_OSONG_TEST ) }}>오송시험선</div>
        <div className="route img4"
        onClick={()=>{ routeSelect( ROUTE_KTX_EXPRESS ) }}>KTX 경부고속선</div>
      </div>
    </div>
  );
}

export default RouteSelection;
