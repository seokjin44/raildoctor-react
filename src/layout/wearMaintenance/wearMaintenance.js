import "./wearMaintenance.css";
import PlaceInfo from "../../component/PlaceInfo/PlaceInfo";
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useState } from "react";
import { Radio, Slider, Input } from "antd";
import ModalCustom from "../../component/Modal/Modal";
import WearInfo from "../../component/WearInfo/WearInfo";
import 'dayjs/locale/ko';
import { Select } from 'antd';
import { Box, Modal } from "@mui/material";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import { BOXSTYLE, INSTRUMENTATIONPOINT, RADIO_STYLE, RANGEPICKERSTYLE, STRING_CORNER_WEAR, STRING_DOWN_TRACK, STRING_ROUTE_INCHON, STRING_ROUTE_SEOUL, STRING_SELECT_WEAR_CORRELATION_MGT, STRING_SELECT_WEAR_CORRELATION_RAILVAL, STRING_TRACK_SIDE_LEFT, STRING_TRACK_SIDE_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_VERTICAL_WEAR, STRING_WEAR_MODEL_CAT_BOOST, STRING_WEAR_MODEL_KP, STRING_WEAR_MODEL_LGBM, STRING_WEAR_MODEL_LOGI_LASSO, STRING_WEAR_MODEL_LOGI_STEPWISE, STRING_WEAR_MODEL_LR_LASSO, STRING_WEAR_MODEL_LR_STEPWISE, STRING_WEAR_MODEL_RANDOM_FOREST, STRING_WEAR_MODEL_SVR, STRING_WEAR_MODEL_XGB, UP_TRACK } from "../../constant";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import axios from 'axios';
import qs from 'qs';
import { convertToCustomFormat, convertToNumber2, dateFormat, filterArrays, findRange, getInchonSpeedData, getRailroadSection, getSeoulSpeedData, mgtToM, nonData, numberWithCommas, trackLeftRightToString, trackNumberToString, trackToString, wearModelTableBody, wearModelTableHeader1, wearModelTableHeader2, zeroToNull } from "../../util";
import lodash, { isEmpty } from "lodash";

const { TextArea } = Input;
let wear3DMinMax = [];
let wearFilter = [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR];
function WearMaintenance( props ) {
  const [selectedPath, setSelectedPath] = useState({
    "start_station_name": "",
    "end_station_name": "",
    "beginKp": 0,
    "endKp": 0,
  });
  const [selectKP, setSelectKP] = useState({
    name : "",
    trackType : UP_TRACK
  });
  const [wearSearchCondition, setWearSearchCondition] = useState({
    startDate: new Date().getTime() - (31536000000 * 7),
    endDate: new Date().getTime(),
    startMGT: 0,
    endMGT: 50000000000
  });
  const [wear3dData, setWear3dData] = useState([]);
  const [viewWear3dData, setViewWear3dData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  /* const [kp, setKP] = useState("0"); */
  const [dataExits, setDataExits] = useState([]);
  const [cornerWearGraphData, setCornerWearGraphData] = useState([]);
  const [verticalWearGraphData, setVerticalWearGraphData] = useState([]);
  const [selectModel, setSelectModel] = useState("");
  const [tableViewModel, setTableViewModel] = useState("");
  const [modelOptions, setModelOptions] = useState([{value:"",label:""}]);
  const [selectWearCorrelation, setSelectWearCorrelation] = useState("");
  const [tableViewWearCorrelation, setTableViewWearCorrelation] = useState("");
  const [railroadSection, setRailroadSection] = useState([]);
  const [trackSpeedData, setTrackSpeedData] = useState([{trackName:"", data:[]},{trackName:"", data:[]}]);
  const [predictionDetails, setPredictionDetails] = useState([]);

  const [upTrackMeasurePoint, setUpTrackMeasurePoint] = useState([]);
  const [downTrackMeasurePoint, setDownTrackMeasurePoint] = useState([]);
  
  const [dateSliderMinMax, setDateSliderMinMax] = useState({min : 32472144000000, max : 0});
  const [mgtSliderMinMax, setMGTSliderMinMax] = useState({min : 50000000000, max : 0});
  const [trackSpeedFindClosest, setTrackSpeedFindClosest] = useState([]);
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});
  const [trackGeo, setTrackGeo] = useState({});

  const handleClose = () => {
    setOpen(false);
  }
  const handleClose2 = () => {
    setOpen2(false);
  }

  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);

    let dateMinMax = {min : 32472144000000, max : 0};
    let mgtMinMax = {min : 50000000000, max : 0};

    let beginKp = select.beginKp / 1000;
    let endKp = select.endKp / 1000;

    let route = sessionStorage.getItem('route');
    let param = {
      begin_kp : [beginKp],
      end_kp : [endKp],
      rail_track : STRING_DOWN_TRACK,
      railroad_name : route
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/time_and_weight',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      let dateMin = new Date(response.data.minTs).getTime();
      let dateMax = new Date(response.data.maxTs).getTime();
      if( dateMinMax.min > dateMin ){ dateMinMax.min = dateMin; }
      if( dateMinMax.max < dateMax ){ dateMinMax.max = dateMax; }

      let mgtMin = response.data.minAccumulateWeight;
      let mgtMax = response.data.maxAccumulateWeight;
      if( mgtMinMax.min > mgtMin ){ mgtMinMax.min = mgtMin; }
      if( mgtMinMax.max < mgtMax ){ mgtMinMax.max = mgtMax; }
      setDateSliderMinMax(dateMinMax);
      setMGTSliderMinMax(mgtMinMax);
      
      let wearSearchCondition_ = lodash.cloneDeep(wearSearchCondition);
      if( wearSearchCondition_.startDate < dateMin ){ wearSearchCondition_.startDate = dateMin; }
      if( wearSearchCondition_.endDate > dateMax ){ wearSearchCondition_.endDate = dateMax; }
      if( wearSearchCondition_.startMGT < mgtMin ){ wearSearchCondition_.startMGT = mgtMin; }
      if( wearSearchCondition_.endMGT > mgtMax ){ wearSearchCondition_.endMGT = mgtMax; }
      setWearSearchCondition(wearSearchCondition_);
    })
    .catch(error => console.error('Error fetching data:', error));

    param = {
      begin_kp : [beginKp],
      end_kp : [endKp],
      rail_track : STRING_UP_TRACK,
      railroad_name : route
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/time_and_weight',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      let dateMin = new Date(response.data.minTs).getTime();
      let dateMax = new Date(response.data.maxTs).getTime();
      if( dateMinMax.min > dateMin ){ dateMinMax.min = dateMin; }
      if( dateMinMax.max < dateMax ){ dateMinMax.max = dateMax; }

      let mgtMin = response.data.minAccumulateWeight;
      let mgtMax = response.data.maxAccumulateWeight;
      if( mgtMinMax.min > mgtMin ){ mgtMinMax.min = mgtMin; }
      if( mgtMinMax.max < mgtMax ){ mgtMinMax.max = mgtMax; }
      setDateSliderMinMax(dateMinMax);
      setMGTSliderMinMax(mgtMinMax);
            
      let wearSearchCondition_ = lodash.cloneDeep(wearSearchCondition);
      if( wearSearchCondition_.startDate < dateMin ){ wearSearchCondition_.startDate = dateMin; }
      if( wearSearchCondition_.endDate > dateMax ){ wearSearchCondition_.endDate = dateMax; }
      if( wearSearchCondition_.startMGT < mgtMin ){ wearSearchCondition_.startMGT = mgtMin; }
      if( wearSearchCondition_.endMGT > mgtMax ){ wearSearchCondition_.endMGT = mgtMax; }
      setWearSearchCondition(wearSearchCondition_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getTrackGeo = ( kp_ ) => {
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/railroads/rails',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        kp :  parseInt(kp_) / 1000 
      }
    })
    .then(response => {
      console.log(response.data);
      setTrackGeo(response.data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }
  
  const timeFormatDate = (milliSeconds) => {
    let d = new Date(milliSeconds); 
    var date1=d.getFullYear()+'/'+((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+'/'+(d.getDate()<10?"0"+d.getDate():d.getDate());
    return date1;
  }

  const onChangeTimeSlider = (newValue) => {
    console.log(timeFormatDate(newValue[0]) + "   ~   " + timeFormatDate(newValue[1]));
    setWearSearchCondition( prevWearSearchCondition =>{
      const wearSearchCondition_ = lodash.cloneDeep(prevWearSearchCondition);
      wearSearchCondition_.startDate = newValue[0];
      wearSearchCondition_.endDate = newValue[1];
      return wearSearchCondition_;
    });
  };

  const onChangeMgtSlider = (newValue) => {
    console.log(newValue);
    setWearSearchCondition( prevWearSearchCondition =>{
      const wearSearchCondition_ = lodash.cloneDeep(prevWearSearchCondition);
      wearSearchCondition_.startMGT = newValue[0];
      wearSearchCondition_.endMGT = newValue[1];
      return wearSearchCondition_;
    });
  };

  const getAccRemainingData = (kp_, railTrack)=>{
    if( !kp_ || kp_ === "" || kp_ === null || kp_ === undefined){
      alert("KP를 입력해주세요");
      return;
    }

    let route = sessionStorage.getItem('route');
    let param  = {
      railroad_name : route,
      measure_ts : new Date().toISOString(),
      rail_track : railTrack,
      kp : (convertToNumber2(kp_) / 1000)
    }
    console.log(param);
    axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remaining`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setLeftRemaining(response.data.leftRemaining);
      setRightRemaining(response.data.rightRemaining);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const onClickWearSearch = () => {
    if( !selectModel || selectModel === "" || selectModel === null || selectModel === undefined ){
      alert("마모예측 상관성 및 예측모델을 선택해주세요.");
      return;
    }

    if( wearSearchCondition.startDate < dateSliderMinMax.min || 
        wearSearchCondition.endDate > dateSliderMinMax.max
    ){
      alert("선택한 계측기간의 최소값과 최대값이 맞지않습니다. 재조정 해주세요.");
      return;
    }

    if( wearSearchCondition.startMGT < mgtSliderMinMax.min || 
        wearSearchCondition.endMGT > mgtSliderMinMax.max
    ){
      alert("선택한 통과톤수의 최소값과 최대값이 맞지않습니다. 재조정 해주세요.");
      return;
    }

    let startKP = selectKP.beginKp / 1000;
    let endKP = selectKP.beginKp / 1000;
    console.log(startKP);
    console.log(endKP);
    let route = sessionStorage.getItem('route');
    let param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      minAccumulateWeight : wearSearchCondition.startMGT,
      maxAccumulateWeight : wearSearchCondition.endMGT,
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      graphType : "TWO_DIMENTION",
      prediction_method : selectModel
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/graph_data',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      if( response.data.cornerWearGraph.length < 1 &&
          response.data.verticalWearGraph.length < 1 ){
          alert("데이터가 없습니다.")
      }
      setCornerWearGraphData(response.data.cornerWearGraph);
      setVerticalWearGraphData(response.data.verticalWearGraph);
    })
    .catch(error => console.error('Error fetching data:', error));

    startKP = selectedPath.beginKp / 1000;
    endKP = selectedPath.endKp / 1000;
    param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      minAccumulateWeight : wearSearchCondition.startMGT,
      maxAccumulateWeight : wearSearchCondition.endMGT,
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      graphType : "THREE_DIMENTION",
      prediction_method : selectModel
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/graph_data',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      let cornerWearGraph = response.data.cornerWearGraph;
      let verticalWearGraph = response.data.verticalWearGraph;
/*       setCornerWearGraphData(cornerWearGraph);
      setVerticalWearGraphData(verticalWearGraph); */
      let wear3DData = makeWear3dData(cornerWearGraph, verticalWearGraph, [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR], []);
      setWear3dData(wear3DData);
      setViewWear3dData(wear3DData);
    })
    .catch(error => console.error('Error fetching data:', error));

    param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      prediction_method : selectModel
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/predictions',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setPredictionDetails(response.data.predictionDetails);
    })
    .catch(error => console.error('Error fetching data:', error));
    setTableViewModel(lodash.cloneDeep(selectModel));
    setTableViewWearCorrelation(lodash.cloneDeep(selectWearCorrelation));
  }

  const makeWear3dData = (cornerWearGraph, verticalWearGraph, fliter, minmax) => {
    console.log("makeWear3dData");
    let leftTrackMGT = [];
    let leftTrackKP = [];
    let leftTrackWear = [];
    let leftTrackPrediction = [];

    let rightTrackMGT = [];
    let rightTrackKP = [];
    let rightTrackWear = [];
    let rightTrackPrediction = [];

    if( fliter.indexOf(STRING_CORNER_WEAR) > -1 ){
      for( let data of cornerWearGraph ){
        if( data.railSide === STRING_TRACK_SIDE_LEFT ){
          leftTrackMGT.push( data.accumulateWeight );
          leftTrackKP.push( data.kp * 1000 );
          leftTrackWear.push( zeroToNull(data.wear) );
          leftTrackPrediction.push( zeroToNull(data.prediction) );
        }
        if( data.railSide === STRING_TRACK_SIDE_RIGHT ){
          rightTrackMGT.push( data.accumulateWeight );
          rightTrackKP.push( data.kp * 1000 );
          rightTrackWear.push( zeroToNull(data.wear) );
          rightTrackPrediction.push( zeroToNull(data.prediction) );
        }else{
          /* upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear ); */
        }
      }
    }

    if( fliter.indexOf(STRING_VERTICAL_WEAR) > -1 ){
      for( let data of verticalWearGraph ){
        if( data.railSide === STRING_TRACK_SIDE_LEFT ){
          leftTrackMGT.push( data.accumulateWeight );
          leftTrackKP.push( data.kp * 1000 );
          leftTrackWear.push( zeroToNull(data.wear) );
          leftTrackPrediction.push( zeroToNull(data.prediction) );
        }
        if( data.railSide === STRING_TRACK_SIDE_RIGHT ){
          rightTrackMGT.push( data.accumulateWeight );
          rightTrackKP.push( data.kp * 1000 );
          rightTrackWear.push( zeroToNull(data.wear) );
          rightTrackPrediction.push( zeroToNull(data.prediction) );
        }else{
          /* upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear ); */
        }
      }
    }

    let min = minmax[0];
    let max = minmax[1];
    
    let uniqueLeftTrackKP = [...new Set(leftTrackKP)]; // type1Y에서 고유값 추출
    let LeftTraces = uniqueLeftTrackKP.map(yValue => {
      // 동일한 Y 값을 가진 데이터 포인트들로 구성된 배열 생성
      let indices = leftTrackKP.map((val, idx) => val === yValue ? idx : -1).filter(idx => idx !== -1);
      let xValues = indices.map(idx => leftTrackMGT[idx]);
      let zValues = indices.map(idx => leftTrackWear[idx]);
            
      if( minmax && minmax.length === 2 ){
        let [x, y, z] = filterArrays(min, max, xValues, indices, zValues);
        xValues = x; indices = y; zValues = z;
      }
      // 고유 Y 값에 대한 trace 생성
      return {
        x: xValues,
        y: indices.map(() => yValue), // 모든 포인트에 동일한 Y 값 할당
        z: zValues,
        mode: 'lines+markers',
        type: 'scatter3d',
        name: "좌레일 @ Y=" + yValue,
        marker: {
          size: 2,
          color: "red"
        },
      };
    });

    let LeftPredictionTraces = uniqueLeftTrackKP.map(yValue => {
      // 동일한 Y 값을 가진 데이터 포인트들로 구성된 배열 생성
      let indices = leftTrackKP.map((val, idx) => val === yValue ? idx : -1).filter(idx => idx !== -1);
      let xValues = indices.map(idx => leftTrackMGT[idx]);
      let zValues = indices.map(idx => leftTrackPrediction[idx]);
            
      if( minmax && minmax.length === 2 ){
        let [x, y, z] = filterArrays(min, max, xValues, indices, zValues);
        xValues = x; indices = y; zValues = z;
      }
      // 고유 Y 값에 대한 trace 생성
      return {
        x: xValues,
        y: indices.map(() => yValue), // 모든 포인트에 동일한 Y 값 할당
        z: zValues,
        mode: 'lines+markers',
        type: 'scatter3d',
        name: "좌레일예측 @ Y=" + yValue,
        marker: {
          size: 2,
          color: "yellow"
        },
      };
    });

    let uniqueRightTrackKP = [...new Set(rightTrackKP)]; // type1Y에서 고유값 추출
    let rightTraces = uniqueRightTrackKP.map(yValue => {
      // 동일한 Y 값을 가진 데이터 포인트들로 구성된 배열 생성
      let indices = rightTrackKP.map((val, idx) => val === yValue ? idx : -1).filter(idx => idx !== -1);
      let xValues = indices.map(idx => rightTrackMGT[idx]);
      let zValues = indices.map(idx => rightTrackWear[idx]);
      
      if( minmax && minmax.length === 2 ){
        let [x, y, z] = filterArrays(min, max, xValues, indices, zValues);
        xValues = x; indices = y; zValues = z;
      }
      // 고유 Y 값에 대한 trace 생성
      return {
        x: xValues,
        y: indices.map(() => yValue), // 모든 포인트에 동일한 Y 값 할당
        z: zValues,
        mode: 'lines+markers',
        type: 'scatter3d',
        name: "우레일",
        marker: {
          size: 2,
          color: "blue"
        },
      };
    });
    
    let rightPredictionTraces = uniqueRightTrackKP.map(yValue => {
      // 동일한 Y 값을 가진 데이터 포인트들로 구성된 배열 생성
      let indices = rightTrackKP.map((val, idx) => val === yValue ? idx : -1).filter(idx => idx !== -1);
      let xValues = indices.map(idx => rightTrackMGT[idx]);
      let zValues = indices.map(idx => rightTrackPrediction[idx]);
            
      if( minmax && minmax.length === 2 ){
        let [x, y, z] = filterArrays(min, max, xValues, indices, zValues);
        xValues = x; indices = y; zValues = z;
      }
      // 고유 Y 값에 대한 trace 생성
      return {
        x: xValues,
        y: indices.map(() => yValue), // 모든 포인트에 동일한 Y 값 할당
        z: zValues,
        mode: 'lines+markers',
        type: 'scatter3d',
        name: "우레일예측 @ Y=" + yValue,
        marker: {
          size: 2,
          color: "green"
        },
      };
    });

    let data = [ ...LeftTraces, ...rightTraces, ...LeftPredictionTraces, ...rightPredictionTraces ];
    return data;
  }

  const [resizeOn, setResizeOn] = useState(0);
  const resizeChange = () => {
    console.log("resizeChange");
    setResizeOn(prevScales=>{
      return prevScales+1
    });
  }

  useEffect(() => {
    // 이벤트 리스너 추가
    window.addEventListener('resize', resizeChange);

    getRailroadSection(setRailroadSection);
    let route = sessionStorage.getItem('route');
    if( route === STRING_ROUTE_INCHON ){
      getInchonSpeedData(setTrackSpeedData);
    }else if( route === STRING_ROUTE_SEOUL ){
      getSeoulSpeedData(setTrackSpeedData);
    }

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {window.removeEventListener('resize', resizeChange )};
  }, []);
  
  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    let route = sessionStorage.getItem('route');
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/kp',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroadName : route,
        begin : railroadSection[0].displayName,
        end : railroadSection[railroadSection.length-1].displayName
      }
    })
    .then(response => {
      let dataArr = [];
      railroadSection.forEach( data => {
        dataArr.push(0);
      });
      let dataExits_ = [...dataArr];

      console.log(response.data);
      for( let data of response.data.t1 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;        
      }
      for( let data of response.data.t2 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;
      }

      setUpTrackMeasurePoint([...new Set(response.data.t2)]);
      setDownTrackMeasurePoint([...new Set(response.data.t1)]);
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])

  return (
    <div className="wearMaintenance" >
      <div className="railStatusContainer">
        <RailStatus 
          resizeOn={resizeOn}
          railroadSection={railroadSection} 
          pathClick={pathClick}
          dataExits={dataExits}
        ></RailStatus>
      </div>
      <div className="dataContainer">
        <div className="scrollContainer" style={{ width: "calc(100%)", height: "calc(100% - 0px)", overflow: "auto"}}>
          <div className="graphSection">
            <div className="contentBox searchContainer mr10">
              <div className="containerTitle">조회 조건</div>
                <div className="componentBox">
                  <div className="flex flexDirectionColumn margin10" style={{"height": "calc(100% - 20px)", "justify-content": "flex-start"}}>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">계측 위치</div>
                      <div className="flex">
                          <Input placeholder="KP" value={selectKP.name} style={RANGEPICKERSTYLE} />
                      </div>
                    </div>
                    <div className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                      <div className="flex bothEnds valueBox">
                        <label className="textBold title">계측기간</label>
                        <div className="flex dataText">
                          <div id="startWearDate">{timeFormatDate(new Date(wearSearchCondition.startDate))}</div>
                          <div>~</div>
                          <div id="endWearDate">{timeFormatDate(new Date(wearSearchCondition.endDate))}</div>
                        </div>
                      </div>
                      <div className="flex" tyle={{height:'30px'}}>
                        <div className="sliderContainer">
                          <Slider 
                            range={{ draggableTrack: true }} 
                            min={dateSliderMinMax.min} 
                            max={dateSliderMinMax.max} 
                            defaultValue={[dateSliderMinMax.min, dateSliderMinMax.max]} tooltip={{ open: false, }} 
                            onChange={onChangeTimeSlider} step={86400000}/>
                        </div>
                      </div>
                    </div>
                    <div  className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                      <div className="flex bothEnds valueBox">
                        <label className="textBold title">통과톤수</label>
                        <div className="flex dataText">
                          <div id="startWearMGT">{mgtToM(wearSearchCondition.startMGT)}</div>
                          <div>~</div>
                          <div id="endWearMGT">{mgtToM(wearSearchCondition.endMGT)}</div>
                          <div style={{marginLeft: "5px"}}>MGT</div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="sliderContainer">
                          <Slider 
                            range={{ draggableTrack: true }} 
                            min={mgtSliderMinMax.min} 
                            max={mgtSliderMinMax.max} 
                            defaultValue={[mgtSliderMinMax.min, mgtSliderMinMax.max]} 
                            tooltip={{ open: false, }} 
                            onChange={onChangeMgtSlider} step={50}/>
                        </div>
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">마모예측 상관성</div>
                      <div className="flex">
                          <Select
                            defaultValue={selectWearCorrelation}
                            value={selectWearCorrelation}
                            style={{ width: 190 }}
                            onChange={(val)=>{
                              setSelectWearCorrelation(val);
                              if( val === STRING_SELECT_WEAR_CORRELATION_MGT ){
                                setModelOptions([
                                  {value:STRING_WEAR_MODEL_KP,label:"선형회귀모형"}
                                ])
                                setSelectModel(STRING_WEAR_MODEL_KP);
                              }else if( val === STRING_SELECT_WEAR_CORRELATION_RAILVAL ){
                                setModelOptions([
                                  {value:STRING_WEAR_MODEL_LR_LASSO,label:"선형회귀모형 LASSO"},
                                  {value:STRING_WEAR_MODEL_LR_STEPWISE,label:"선형회귀모형 Stepwise"},
                                  {value:STRING_WEAR_MODEL_LOGI_LASSO,label:"로지스틱 LASSO"},
                                  {value:STRING_WEAR_MODEL_LOGI_STEPWISE,label:"로지스틱 Stepwise"},
                                  {value:STRING_WEAR_MODEL_SVR,label:"SVR"},
                                  {value:STRING_WEAR_MODEL_RANDOM_FOREST,label:"랜덤포레스트"},
                                  {value:STRING_WEAR_MODEL_XGB,label:"XGBoost"},
                                  {value:STRING_WEAR_MODEL_LGBM,label:"Light GBM"},
                                  {value:STRING_WEAR_MODEL_CAT_BOOST,label:"CatBoost"}
                                ]);
                                setSelectModel(STRING_WEAR_MODEL_LR_LASSO);
                              }
                            }}
                            options={
                              [
                                {value:"mgt",label:"누적통과톤수만 고려"},
                                {value:"railVal",label:"레일특성변수 모두고려"}
                              ]
                            }
                          />
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">예측모델</div>
                      <div className="flex">
                          <Select
                            defaultValue={selectModel}
                            value={selectModel}
                            style={{ width: 190 }}
                            onChange={(val)=>{setSelectModel(val)}}
                            options={
                              /* [
                                {value:"선형회귀모형",label:"선형회귀모형"},
                                {value:"로지스틱 회귀모형",label:"로지스틱 회귀모형"},
                                {value:"SVM",label:"SVM"},
                                {value:"랜덤포레스트",label:"랜덤포레스트"},
                                {value:"XGBoost",label:"XGBoost"},
                                {value:"Light GBM",label:"Light GBM"},
                                {value:"CatBoost",label:"CatBoost"}
                              ] */
                              modelOptions
                            }
                          />
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">최근누적통과톤수</div>
                      <div className="flex acc">
                        {( !isEmpty(leftRemaining) )?<div>좌레일 : {numberWithCommas(leftRemaining.accumulateweight)}</div> : null}
                        {( !isEmpty(rightRemaining) )?<div>우레일 : {numberWithCommas(rightRemaining.accumulateweight)}</div> : null}
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">속도정보</div>
                      <div className="flex trackSpeedFindClosest">
                      {
                        trackSpeedFindClosest.map( closest => {
                          return <div className="line"><div style={{backgroundColor : closest.color}} className="closestIcon"></div><div style={{marginLeft: "5px"}}>{closest.name}</div><div>: {`${parseFloat(closest.speed).toFixed(1)}km/h`}</div></div>;
                        })
                      }
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">선형정보</div>
                      <div className="flex linear ">
                        <div className="line">
                          <div className="title">상선 </div>
                          {nonData(trackGeo?.t2?.shapeDisplay)} /
                            R={nonData(trackGeo?.t2?.direction)} {nonData(trackGeo?.t2?.radius)} (C={nonData(trackGeo?.t2?.cant)}, S={nonData(trackGeo?.t2?.slack)})
                        </div>
                        <div className="line">
                          <div className="title">하선 </div>
                          {nonData(trackGeo?.t1?.shapeDisplay)} /
                            R={nonData(trackGeo?.t1?.direction)} {nonData(trackGeo?.t1?.radius)} (C={nonData(trackGeo?.t1?.cant)}, S={nonData(trackGeo?.t1?.slack)})
                        </div>
                      </div>
                    </div>
                    <div className="flex flexCenter" style={{flexDirection: "row-reverse"}} >
                      <button className="searchButton" onClick={onClickWearSearch}>조회</button>
                    </div>
                  </div>
                    

                </div>
              </div>
            <div className="rightContainer">
              <div className="contentBox pointContainer">
                <div className="containerTitle">지점정보</div>
                <div className="componentBox">
                  <PlaceInfo 
                    selectKP={selectKP}
                    setSelectKP={(selectKP)=>{
                      setSelectKP(selectKP);
                      getTrackGeo(convertToNumber2(selectKP.name));
                      getAccRemainingData(selectKP.name, selectKP.trackType);
                    }}
                    path={selectedPath} 
                    instrumentationPoint={INSTRUMENTATIONPOINT}
                    upTrackMeasurePoint = {upTrackMeasurePoint}
                    downTrackMeasurePoint = {downTrackMeasurePoint}
                  ></PlaceInfo>
                </div>
              </div>
              <div className="mamoGraphContainer">
                <div className="contentBox wearContainer" style={{marginLeft : 0, height:"100%"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                    <div className="flex">
                      <ModalCustom buttonLabel="3D 상세보기" title="3D 상세보기" 
                        data={viewWear3dData}
                        dataSliderSort={(e)=>{
                          console.log("dataSliderSort");
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, wearFilter, [e[0], e[1]]);
                          wear3DMinMax = e;
                          setViewWear3dData(wear3DData);
                        }}
                        changeCheckBox={(e)=>{
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, e, wear3DMinMax);
                          wearFilter = e;
                          setViewWear3dData(wear3DData);
                        }}
                        closeModal={()=>{
                          setViewWear3dData(lodash.cloneDeep(wear3dData))
                          wearFilter = [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR];
                          wear3DMinMax = [];
                        }}
                      ></ModalCustom>
                      <div className="modalButton highlight" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen(true);
                      }} >예측데이터 상세보기</div>
                      <div className="modalButton highlight orange" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen2(true);
                      }} >의사결정</div>
                    </div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" 
                        data={verticalWearGraphData} 
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" 
                        data={cornerWearGraphData} 
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="leftContainer">
              <div className="contentBox speedContainer" style={{height:"165px"}}>
                <div className="containerTitle">통과속도 정보</div>
                <div className="componentBox" style={{ marginRight: "10px", width: "calc(100% - 10px)", overflow: "hidden"}}>
                  <div className="demoImgContainer">
                    <TrackSpeed 
                      data={trackSpeedData} 
                      kp={convertToNumber2(selectKP.name)} 
                      findClosest={(e)=>{setTrackSpeedFindClosest(e)}}
                    ></TrackSpeed>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="popupTitle"><img src={PopupIcon} />예측데이터 상세</div>
            <div className="popupContent">
              <div className="contentBox" style={{ height: "700px", marginTop : "10px", width: "1500px", overflow:"auto"}} >
                <div className="containerTitle">예측결과
                  {/* <div className="dataOption">
                    <div className="value">
                      Update : 2023.01.25
                    </div>
                  </div> */}
                </div>
                <div className="componentBox flex section " style={{ paddingTop: "5px",
                      paddingBottom: "5px",
                      height: "calc(100% - 37px)",
                      paddingLeft: "5px",
                      flexDirection: "column",
                      width: "calc( 100% - 12px)" }} >
                  {/* <div className="dataBox" style={{display:"flex"}}>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>예측 누적통과톤수</div>
                      <div class="optionValue">414,953,971</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>기준직마모량</div>
                      <div class="optionValue">13mm</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>기준편마모량</div>
                      <div class="optionValue">15mm</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>갱환시기</div>
                      <div class="optionValue">6억톤</div>
                    </div>
                  </div> */}
                  <div className={`table ${tableViewWearCorrelation}`} style={{ justifyContent: "flex-start", alignItems: 'baseline' }}>
                    <div className="tableHeader" style={{width: 'calc(100% - 20px)'}}>
                      <div className="tr">
                        <div className="td driving colspan2"><div className="colspan2">열차운행방향</div></div>
                        <div className="td kp colspan2"><div className="colspan2">KP</div></div>
                        <div className="td rail colspan2"><div className="colspan2">좌우레일</div></div>
                        <div className="td mamo colspan2"><div className="colspan2">마모</div></div>
                        {/* <div className="td date colspan2"><div className="colspan2">예측일자</div></div> */}
                        <div className="td ton colspan2"><div className="colspan2">누적통과톤수</div></div>
                        {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                        <>
                          <div className="td value1"><div className="">레일 예측마모량(mm)</div></div>
                        </>
                        :
                          wearModelTableHeader1(tableViewModel)
                        }

                        {/* <div className="td value2 colspan2"><div className="colspan2">레일 실측마모량</div></div> */}
                        {/* <div className="td value3 colspan2"><div className="colspan2">마모량(예측-실측)</div></div> */}
                        <div className={`td value4 ${tableViewWearCorrelation} rowspan3`}><div className="rowspan3">갱환시기 예측</div></div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                      </div>
                      <div className="tr">
                        <div className="td driving"></div>
                        <div className="td kp"></div>
                        <div className="td rail"></div>
                        <div className="td mamo"></div>
                        {/* <div className="td date "></div> */}
                        <div className="td ton "></div>

                        {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                        <>
                          <div className="td value1 ">선형회귀</div>
                        </>
                        :
                          wearModelTableHeader2(tableViewModel)
                        }
                        {/* <div className="td value2 "></div> */}
                        {/* <div className="td value3 "></div> */}
                        <div className={`td value4 ${tableViewWearCorrelation}`}>로지스틱 마모량 기준</div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}>선형회귀 마모량 기준</div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}>누적통과톤수기준</div>
                      </div>
                    </div>
                    <div className="tableBody" style={{ display:"block", overflowY: "scroll", height: "calc(100% - 48px)", justifyContent: "flex-start"}}>
                      {
                        predictionDetails.map( (detail, i) => {
                          return <><div key={`ver${i}`} className="tr">
                            <div className="td driving colspan2"><div className="colspan2">{trackToString(detail.railTrack)}</div></div>
                            <div className="td kp colspan2"><div className="colspan2">{convertToCustomFormat(detail.kp*1000)}</div></div>
                            <div className="td rail colspan2"><div className="colspan2">{trackLeftRightToString(detail.railTrack)}</div></div>
                            <div className="td mamo">직마모</div>
                            {/* <div className="td date ">{dateFormat(new Date(detail.predictionTs))}</div> */}
                            <div className="td ton colspan2"><div className="colspan2">{numberWithCommas(detail.accumulateWeight)} </div></div>
    
                            {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                            <>
                              <div className="td value1 ">{detail.verticalKpWear}</div>
                            </>
                            :
                              wearModelTableBody(tableViewModel, detail, STRING_VERTICAL_WEAR)
                            }
                            {/* <div className="td value2 ">-</div> */}
                            {/* <div className="td value3 ">10mm</div> */}
                            <div className={`td value4 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.logiNextWeightToReplace)} - ${dateFormat(new Date(detail.logiNextTimeToReplace))}`}</div></div>
                            <div className={`td value5 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.lrNextWeightToReplace)} - ${dateFormat(new Date(detail.lrNextTimeToReplace))}`}</div></div>
                            <div className={`td value5 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.kpNextWeightToReplace)} - ${dateFormat(new Date(detail.kpNextTimeToReplace))}`}</div></div>
                          </div>
                          <div key={`cor${i}`} className="tr">
                            <div className="td driving"></div>
                            <div className="td kp"></div>
                            <div className="td rail"></div>
                            <div className="td mamo">편마모</div>
                            {/* <div className="td date ">{dateFormat(new Date(detail.predictionTs))}</div> */}
                            <div className="td ton "></div>
    
                            {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                            <>
                              <div className="td value1 ">{detail.cornerKpWear}</div>
                            </>
                            :
                              wearModelTableBody(tableViewModel, detail, STRING_CORNER_WEAR)
                            }
                            {/* <div className="td value2 ">-</div> */}
                            {/* <div className="td value3 ">10mm</div> */}
                            <div className={`td value4 ${tableViewWearCorrelation}`}></div>
                            <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                            <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                          </div>
                          </>
                        })
                      }
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={open2}
          onClose={(e)=>{handleClose2()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />선로 마모 심각 
              <div className="closeBtn" onClick={()=>{setOpen2(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="contentBox wearContainer" style={{marginLeft : 0, height:"515px"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" 
                        data={verticalWearGraphData}
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" 
                        data={cornerWearGraphData}
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                  </div>
              </div>

              <div className="comment" style={{ marginTop: "20px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={3} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">
                  유지보수 의사결정
                  <div className="radioGroup">
                    <Radio.Group style={RADIO_STYLE} >
                      <Radio value={1}>알람무시</Radio>
                      <Radio value={2}>점검 후 조치</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="commentInput">
                  <TextArea rows={3} />
                </div>
              </div>

            </div>
            <div className="decisionButtonContainer">
              <div className="button">유지보수 의사결정 등록</div>
            </div>
          </Box>
        </Modal>


    </div>
  );
}

export default WearMaintenance;

