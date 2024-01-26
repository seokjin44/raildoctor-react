import "./dataUpload.css";
import ListIcon from "../../assets/icon/list.png";
import UploadIcon from "../../assets/icon/216485_upload_icon_w.png";
import DownloadIcon from "../../assets/icon/download_w.png";
import { useEffect, useState } from "react";
import classNames from "classnames";
import TreeList from 'react-treelist';
import 'react-treelist/build/css/index.css';
import axios from 'axios';
import qs from 'qs';
import { convertBytesToMB, curPagingCheck, curPagingText, flattenTreeData, formatDateTime, getRoute, measureTypeText, trackToString, trackToString2, uploadState, uploadStateBtn } from "../../util";
import { useRef } from "react";
import { Button, DatePicker, Input, Modal, Select } from "antd";
import { BOXSTYLE, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_LONG_MEASURE, STRING_ROUTE_GYEONGBU, STRING_ROUTE_INCHON, STRING_ROUTE_OSONG, STRING_ROUTE_SEOUL, STRING_SHORT_MEASURE, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, UPLOAD_CATEGORY_ACCUMULATEWEIGHTS, UPLOAD_CATEGORY_RAILBEHAVIORS, UPLOAD_CATEGORY_RAILPROFILES, UPLOAD_CATEGORY_RAILROUGHNESS, UPLOAD_CATEGORY_RAILSTRAIGHTS, UPLOAD_CATEGORY_RAILTWISTS, UPLOAD_CATEGORY_RAILWEARS, UPLOAD_CATEGORY_TEMPERATURES, UPLOAD_STATE_APPLYING, UPLOAD_STATE_APPLY_FAIL, UPLOAD_STATE_APPLY_SUCCESS, UPLOAD_STATE_CONVERTING, UPLOAD_STATE_CONVERT_FAIL, UPLOAD_STATE_CONVERT_SUCCESS, UPLOAD_STATE_UPLOADED } from "../../constant";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import Search from "antd/es/input/Search";
import { SearchOutlined, DeleteOutlined, AppstoreAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { RangePicker } = DatePicker;
let route = getRoute();
let interval = null;

function DataUpload( props ) {
  const hiddenFileInput = useRef(null);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [ trList, setTrList ] = useState([]);
  const [ active, setActive ] = useState(UPLOAD_CATEGORY_ACCUMULATEWEIGHTS);
  const [ totalCnt, setTotalCnt ] = useState(0);
  const [ showrows, setShowrows ] = useState(25);
  const [ curPage, setCurPage ] = useState(1);
  const [ dataCnt, setDataCnt ] = useState(0);
  const [ dataSize, setDataSize ] = useState(0);
  const [ weekDataCnt, setWeekDataCnt ] = useState(0);
  const [ weekDataSize, setWeekDataSize ] = useState(0);

  const [ railbehaviorsMeasureList, setRailbehaviorsMeasureList ] = useState({entities : [], count : 1});
  const [ railbehaviorsRoute, setRailbehaviorsRoute ] = useState(route);
  const [ railbehaviorsDisplayName, setRailbehaviorsDisplayName ] = useState("");
  const [ railbehaviorsMeasureType, setRailbehaviorsMeasureType ] = useState(STRING_SHORT_MEASURE);
  const [ railbehaviorsDateRange, setRailbehaviorsDateRange ] = useState(null);
  const [ railbehaviorsBeginKp, setRailbehaviorsBeginKp ] = useState("");
  const [ railbehaviorsEndKp, setRailbehaviorsEndKp ] = useState("");
  const [ railbehaviorsViewData, setRailbehaviorsViewData ] = useState({});

  const [ addRailbehaviorsRoute, setAddRailbehaviorsRoute ] = useState(route);
  const [ addRailbehaviorsDisplayName, setAddRailbehaviorsDisplayName ] = useState("");
  const [ addRailbehaviorsMeasureType, setAddRailbehaviorsMeasureType ] = useState(STRING_SHORT_MEASURE);
  const [ addRailbehaviorsDateRange, setAddRailbehaviorsDateRange ] = useState(null);
  const [ addRailbehaviorsT2BeginKp, setAddRailbehaviorsT2BeginKp ] = useState("");
  const [ addRailbehaviorsT2EndKp, setAddRailbehaviorsT2EndKp ] = useState("");
  const [ addRailbehaviorsT1BeginKp, setAddRailbehaviorsT1BeginKp ] = useState("");
  const [ addRailbehaviorsT1EndKp, setAddRailbehaviorsT1EndKp ] = useState("");
  const [ addRailbehaviorsSensorList, setAddRailbehaviorsSensorList ] = useState([]);

  const activeChange = ( category ) => {
    setActive(category);
    getList(category);
    getDataStatistics(category);
    clearInterval(interval);
    interval = setInterval(() => {
      getList(category);
    }, 5000);
  }

  const getRailbehaviorsMeasureList = () => {
    let param = {
      /* asc : ["DISPLAY_NAME", "MEASURE_TYPE", "BEGIN_TS", "END_TS"] */
      desc : ["BEGIN_TS"],
      railroad : railbehaviorsRoute,
      displayName : railbehaviorsDisplayName,
      measureType : [railbehaviorsMeasureType],
      beginKp : railbehaviorsBeginKp / 1000,
      endKp : railbehaviorsEndKp / 1000,
      beginTs : railbehaviorsDateRange[0].$d.toISOString(),
      endTs : railbehaviorsDateRange[1].$d.toISOString()
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/measuresets',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setRailbehaviorsMeasureList(response.data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getList = (category) => {
    axios.get('https://raildoctor.suredatalab.kr/api/data',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : {
        /* desc : ["CREATED_AT, ILE_NAME, FILE_SIZE, STATE"], */
        category : [category],
        /* state : ["UPLOADED"], */
        limit : showrows,
        offset : (curPage-1)*showrows
      }
    })
    .then(response => {
      console.log(response.data);
      /* console.log(flattenTreeData(response.data.entities)); */
      setTrList(response.data.entities);
      setTotalCnt(response.data.count);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getDataStatistics = (category) => {
    axios.get('https://raildoctor.suredatalab.kr/api/data/statistics',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : {
        railroad  : route,
        category : [category],
      }
    })
    .then(response => {
      console.log(response.data);
      setDataCnt(response.data.dataCount);
      setDataSize(response.data.dataSize);
    })
    .catch(error => console.error('Error fetching data:', error));

    let currentDate = new Date();
    axios.get('https://raildoctor.suredatalab.kr/api/data/statistics',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : {
        railroad  : route,
        category : [category],
        beginTs : currentDate.toISOString(),
        endTs : new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString()
      }
    })
    .then(response => {
      console.log(response.data);
      setWeekDataCnt(response.data.dataCount);
      setWeekDataSize(response.data.dataSize);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const statusBtn = ( data ) => {
    if( data.state === UPLOAD_STATE_UPLOADED ){
        //return "업로드 완료"
        return "";
    }else if( data.state === UPLOAD_STATE_CONVERTING ){
        //return "변환 중"
        return "";
    }else if( data.state === UPLOAD_STATE_CONVERT_FAIL ){
        //return "변환 실패"
        return "";
    }else if( data.state === UPLOAD_STATE_CONVERT_SUCCESS ){
        //return "변환 성공"
        return <div className="stateBtn" onClick={()=>{
          axios.post(`https://raildoctor.suredatalab.kr/api/data/${data.datumId}`)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => console.error('Error fetching data:', error));   
        }} >데이터 반영</div>
    }else if( data.state === UPLOAD_STATE_APPLYING ){
        //return "시스템에 반영 중"
        return "";
    }else if( data.state === UPLOAD_STATE_APPLY_FAIL ){
        //return "반영 실패"
        return "";
    }else if( data.state === UPLOAD_STATE_APPLY_SUCCESS ){
        //return "반영 성공";
        return "";
    }
  }

  const saveMeasureset = () => {

  } 

  useEffect( () => {
    getList(active);
    getDataStatistics(active);
    interval = setInterval(() => {
      getList(active);
    }, 5000);
    return () => clearInterval(interval);
  }, [] );

  return (
      <div className="dataUpload">
        <div className="uploadMenu">
          <div className="title"><img src={ListIcon} />데이터 관리 목록</div>
          <div className="line"></div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_ACCUMULATEWEIGHTS })} onClick={()=>activeChange(UPLOAD_CATEGORY_ACCUMULATEWEIGHTS)} >누적통과톤수</div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILWEARS })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILWEARS)} >마모유지관리</div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILTWISTS })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILTWISTS)} >궤도틀림</div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILBEHAVIORS })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILBEHAVIORS)} >궤도거동계측</div>
          {/* <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_TEMPERATURES })} onClick={()=>activeChange(UPLOAD_CATEGORY_TEMPERATURES)} >온습도</div> */}
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILROUGHNESS })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILROUGHNESS)} >레일조도</div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILSTRAIGHTS })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILSTRAIGHTS)} >레일직진도</div>
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_RAILPROFILES })} onClick={()=>activeChange(UPLOAD_CATEGORY_RAILPROFILES)} >레일프로파일</div>
        </div>
        <div className="uploadHistory">
          <div className="title">선로열람도</div>
          <div className="info">
            <div className="infoBox">
              <div className="infoTitle">총 등록 데이터 수</div>
              <div className="infoValue">{dataCnt} 건</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">총 등록 데이터 용량</div>
              <div className="infoValue">{convertBytesToMB(dataSize)} MB</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">최근 1주일 간 데이터 등록 건수</div>
              <div className="infoValue">{weekDataCnt} 건</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">1주일간 데이터 등록 용량</div>
              <div className="infoValue">{convertBytesToMB(weekDataSize)} MB</div>
            </div>
          </div>
          <div className="pagination">
            {/* <div className="optionTitle">Go to</div>
            <Input style={{width:100}} placeholder="Page" />
            <div className="line"></div> */}
            <div className="optionTitle">Show rows</div>
            <Select
              value={showrows}
              className="listCnt"
              defaultValue={showrows}
              onChange={(e)=>setShowrows(e)}
              options={[
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100'},
              ]}
            />
            <div className="line"></div>
            <div className="curPaging"> {curPagingCheck(curPage*showrows, totalCnt)} of {totalCnt} </div>
            <div className="wrap" onClick={()=>{
              if(curPage > 1){
                setCurPage(curPage-1);
              }
            }}>
              <i className="arrow left" role="img"></i>
            </div>
            <div className="wrap" onClick={()=>{
              let maxPage = Math.ceil(totalCnt / showrows);
              if( curPage < maxPage){
                setCurPage(curPage+1);
              }
            }}>
              <i className="arrow right" role="img"></i>
            </div>
          </div>
          <div className="uploadBtn" style={{ width: "120px",top: '165px'}}
              onClick={()=>{
                axios.get(`https://raildoctor.suredatalab.kr/api/data/${active}`)
                .then(response => {
                  console.log(response.data);
                  fetch(`https://raildoctor.suredatalab.kr/resources/${response.data.filePath}`)
                  .then(response => response.blob())
                  .then(blob => {
                    const path = response.data.filePath;
                    const filename = path.split('/').pop(); // "22테스트44.xlsx"
                    saveAs(blob, filename);
                  })
                  .catch(e => console.error(e));
                })
                .catch(error => console.error('Error fetching data:', error));   
              }}> 
            포맷파일 다운로드
          </div>
          {
            (active === UPLOAD_CATEGORY_RAILBEHAVIORS) ? 
              <div className="uploadBtn" style={{top: '130px'}}
                onClick={()=>setOpen(true)}
              >측정세트등록</div>
            : null
          }

          <div className="uploadBtn" onClick={()=>{ hiddenFileInput.current.click(); }} >
            <img src={UploadIcon}/>Upload
            <input 
                    ref={hiddenFileInput} 
                    type="file" 
                    style={{display:'none'}} 
                    onChange={(e)=>{
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        const base64String = reader.result;
                        const base64FormattedString = base64String.split(',')[1];
                        let route = getRoute();
                        axios.post(`https://raildoctor.suredatalab.kr/api/data`,
                          {
                            meta : {
                              railroadId:"",
                              category: active,
                              dataType:"DATA",
                              fileName: file.name,
                              params: {},
                              state: "UPLOADED"
                            },
                            data : base64FormattedString,
                            railroadName : route
                          }
                        )
                        .then(response => {
                          console.log(response.data);
                          getList(active);
                        })
                        .catch(error => console.error('Error fetching data:', error));   
                      };
                      reader.onerror = () => {
                        console.error('FileReader에 문제가 발생했습니다.');
                      };
                    }}
                  />
          </div>
          <div className="treeListContainer">
            <div className="table3">
              <div className="tableHeader" >
                <div className="tr">
                  <div className="td createdAt">업로드 날짜</div>
                  <div className="td fileSize">파일크기</div>
                  <div className="td filename">파일명</div>
                  <div className="td fileState">상태</div>
                  <div className="td btn"></div>
                </div>
              </div>
              <div className="tableBody" style={{overflow: "auto", height: "calc( 100% - 35px)"}}>
                {
                  trList.map( (tr, i) => {
                    return <div className="tr" key={i}>
                    <div className="td createdAt">{formatDateTime(new Date(tr.createdAt))}</div>
                    <div className="td fileSize">{`${convertBytesToMB(tr.fileSize)}MB`}</div>
                    <div className="td filename">{tr.fileName}</div>
                    <div className="td fileState">{uploadState(tr.state)}</div>
                    <div className="td btn">
                      {statusBtn(tr)}
                    </div>
                  </div>

                  })
                }
              </div>
            </div>
          </div>
        </div>

        <Modal          
          centered
          open={open}
          onCancel={() => setOpen(false)}
          width={1600}
          className="dataUploadPopup"
          footer={""}>
          <div className="popupTitle"><img src={PopupIcon} />측정세트 목록</div>
          <div className="tabPanel" style={{width:"100%"}}>
            <div className="inputLine">
              <div className="inputTitle">노선</div>
              <div className="inputValue">    
              <Select
                defaultValue={railbehaviorsRoute}
                style={{ width: 160 }}
                onChange={(e)=>{setRailbehaviorsRoute(e)}}
                options={[
                  { value: STRING_ROUTE_INCHON, label: STRING_ROUTE_INCHON },
                  { value: STRING_ROUTE_SEOUL, label: STRING_ROUTE_SEOUL },
                  { value: STRING_ROUTE_OSONG, label: STRING_ROUTE_OSONG },
                  { value: STRING_ROUTE_GYEONGBU, label: STRING_ROUTE_GYEONGBU },
                ]}
              /></div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정지점이름</div>
              <div className="inputValue"><Input 
                value={railbehaviorsDisplayName}
                onChange={(e)=>{setRailbehaviorsDisplayName(e.target.value)}}
                placeholder="측정지점이름" /></div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">계측구분</div>
              <div className="inputValue">
                <Select
                  defaultValue={railbehaviorsMeasureType}
                  style={{ width: 140 }}
                  onChange={(e)=>{setRailbehaviorsMeasureType(e)}}
                  options={[
                    { value: STRING_SHORT_MEASURE, label: "단기계측" },
                    { value: STRING_LONG_MEASURE, label: "장기계측" },
                  ]}
                />
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정기간</div>
              <div className="inputValue">
                <RangePicker 
                  value={railbehaviorsDateRange}
                  onChange={(e)=>{setRailbehaviorsDateRange(e)}} />
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정구간</div>
              <div className="inputValue">
                <Input style={{width : "100px"}} value={railbehaviorsBeginKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setRailbehaviorsBeginKp(numericValue);
                  }}
                  placeholder="시작" /> 
                <div className="range" >-</div> 
                <Search style={{width : "150px"}} value={railbehaviorsEndKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setRailbehaviorsEndKp(numericValue);
                  }}
                  onSearch={(e)=>{
                    getRailbehaviorsMeasureList();
                  }}
                  placeholder="종점" enterButton />

                <Button onClick={(e)=>{
                  setAddOpen(true);
                  setAddRailbehaviorsRoute(railbehaviorsRoute);
                  setAddRailbehaviorsDisplayName("");
                  setAddRailbehaviorsMeasureType(STRING_SHORT_MEASURE);
                  setAddRailbehaviorsDateRange(null);
                  setAddRailbehaviorsT2BeginKp("");
                  setAddRailbehaviorsT2EndKp("");
                  setAddRailbehaviorsT1BeginKp("");
                  setAddRailbehaviorsT1EndKp("");
                  setAddRailbehaviorsSensorList([]);
                  }} style={{marginLeft : "10px"}} type="primary" icon={<AppstoreAddOutlined />}>
                  측정세트추가
                </Button>

              </div>
            </div>
            <div className="devisionLine"></div>
            <div className="dataList">
                <div className="customTable2">
                  <div className="theader">
                    <div className="tr">
                      <div className="td displayName">계측이름</div>
                      <div className="td kp">{trackToString(STRING_UP_TRACK, railbehaviorsRoute)} 시작점</div>
                      <div className="td kp">{trackToString(STRING_UP_TRACK, railbehaviorsRoute)} 종료점</div>
                      <div className="td kp">{trackToString(STRING_DOWN_TRACK, railbehaviorsRoute)} 시작점</div>
                      <div className="td kp">{trackToString(STRING_DOWN_TRACK, railbehaviorsRoute)} 종료점</div>
                      <div className="td measureType">계측구분</div>
                      <div className="td date">측정시작일</div>
                      <div className="td date">측정종료일</div>
                      <div className="td button"></div>
                    </div>
                  </div>
                  <div className="tbody scroll">
                    {railbehaviorsMeasureList.entities.map( (data, i) => {
                      return <div key={`measureList${i}`} className="tr">
                        <div className="td displayName">{data.displayName}</div>
                        <div className="td kp">{data.t2Begin}</div>
                        <div className="td kp">{data.t2End}</div>
                        <div className="td kp">{data.t1Begin}</div>
                        <div className="td kp">{data.t1End}</div>
                        <div className="td measureType">{data.measureType}</div>
                        <div className="td date">{formatDateTime(new Date(data.beginTs))}</div>
                        <div className="td date">{formatDateTime(new Date(data.endTs))}</div>
                        <div className="td button">
                          <Button onClick={(e)=>{
                            setViewOpen(true)
                            setRailbehaviorsViewData(data);
                          }} style={{marginRight : "10px"}} type="primary" icon={<SearchOutlined />}>
                            View
                          </Button>
                          <Button type="primary" danger icon={<DeleteOutlined />}
                            onClick={()=>{
                              axios.delete(`https://raildoctor.suredatalab.kr/api/railbehaviors/measuresets/${data.measureSetId}`)
                              .then(response => {
                                console.log(response.data);
                                getRailbehaviorsMeasureList();
                              })
                              .catch(error => console.error('Error fetching data:', error));
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    } )}
                  </div>
                </div>
            </div>
          </div>
        </Modal>

        <Modal
          /* title="Vertically centered modal dialog" */
          centered
          open={addOpen}
          onCancel={() => setAddOpen(false)}
          width={1600}
          className="dataUploadPopup"
          footer={""}
        >
          <div className="popupTitle"><img src={PopupIcon} />측정세트 등록</div>
          <div className="tabPanel" style={{width:"100%"}}>
            <div className="inputLine">
              <div className="inputTitle">노선</div>
              <div className="inputValue">    
              <Select
                defaultValue={addRailbehaviorsRoute}
                style={{ width: 160 }}
                onChange={(e)=>{setAddRailbehaviorsRoute(e)}}
                options={[
                  { value: STRING_ROUTE_INCHON, label: STRING_ROUTE_INCHON },
                  { value: STRING_ROUTE_SEOUL, label: STRING_ROUTE_SEOUL },
                  { value: STRING_ROUTE_OSONG, label: STRING_ROUTE_OSONG },
                  { value: STRING_ROUTE_GYEONGBU, label: STRING_ROUTE_GYEONGBU },
                ]}
              /></div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정지점이름</div>
              <div className="inputValue"><Input 
                value={addRailbehaviorsDisplayName}
                onChange={(e)=>{setAddRailbehaviorsDisplayName(e.target.value)}}
                placeholder="측정지점이름" /></div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">계측구분</div>
              <div className="inputValue">
                <Select
                  defaultValue={addRailbehaviorsMeasureType}
                  style={{ width: 140 }}
                  onChange={(e)=>{setAddRailbehaviorsMeasureType(e)}}
                  options={[
                    { value: STRING_SHORT_MEASURE, label: "단기계측" },
                    { value: STRING_LONG_MEASURE, label: "장기계측" },
                  ]}
                />
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정기간</div>
              <div className="inputValue">
                <RangePicker 
                  value={addRailbehaviorsDateRange}
                  onChange={(e)=>{setAddRailbehaviorsDateRange(e)}} />
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정구간</div>
              <div className="inputValue">
                <div className="valueName">{trackToString(STRING_UP_TRACK, addRailbehaviorsRoute)}</div> 
                <Input style={{width : "100px"}} value={addRailbehaviorsT2BeginKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setAddRailbehaviorsT2BeginKp(numericValue);
                  }}
                  placeholder="시작" /> 
                <div className="range" >-</div> 
                <Input style={{width : "100px"}} value={addRailbehaviorsT2EndKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setAddRailbehaviorsT2EndKp(numericValue);
                  }}
                  placeholder="종점" /> 
                  <div className="valueName">{trackToString(STRING_DOWN_TRACK, addRailbehaviorsRoute)}</div> 
                  <Input style={{width : "100px"}} value={addRailbehaviorsT1BeginKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setAddRailbehaviorsT1BeginKp(numericValue);
                  }}
                  placeholder="시작" /> 
                <div className="range" >-</div> 
                <Input style={{width : "100px"}} value={addRailbehaviorsT1EndKp} 
                  onChange={(e)=>{
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setAddRailbehaviorsT1EndKp(numericValue);
                  }}
                  placeholder="종점" /> 
                <Button onClick={(e)=>{
                      axios.post(`https://raildoctor.suredatalab.kr/api/railbehaviors/measuresets`,
                      {
                        "railroadId": addRailbehaviorsRoute,
                        "displayName": addRailbehaviorsDisplayName,
                        "t1Begin": addRailbehaviorsT1BeginKp / 1000,
                        "t1End": addRailbehaviorsT1EndKp / 1000,
                        "t2Begin": addRailbehaviorsT2BeginKp / 1000,
                        "t2End": addRailbehaviorsT2EndKp / 1000,
                        "measureType": addRailbehaviorsMeasureType,
                        "beginTs": addRailbehaviorsDateRange[0].$d.toISOString(),
                        "endTs": addRailbehaviorsDateRange[1].$d.toISOString(),
                        "sensors": addRailbehaviorsSensorList,
                        "removeOnSuccess": true
                      }
                    )
                    .then(response => {
                      console.log(response.data);
                    })
                    .catch(error => console.error('Error fetching data:', error));   
                  }} style={{marginLeft : "10px"}} type="primary" icon={<AppstoreAddOutlined />}>
                  측정세트등록
                </Button>
              </div>
            </div>
            <div className="devisionLine"></div>
            <div className="dataList">
                <div className="customTable2">
                  <div className="theader">
                    <div className="tr">
                      <div className="td track">레일구분</div>
                      <div className="td kp">위치</div>
                      <div className="td sensorName">센서명</div>
                      <div className="td number">가속도(최대)</div>
                      <div className="td number">가속도(최소)</div>
                      <div className="td number">레일응력(최소)</div>
                      <div className="td number">레일응력(최대)</div>
                      <div className="td number">윤중(최대)</div>
                      <div className="td number">횡압</div>
                      <div className="td number">수직변위</div>
                      <div className="td number">수평변위</div>
                      <div className="td number">속도</div>
                      <div className="td del"></div>
                    </div>
                  </div>
                  <div className="tbody scroll">
                    {addRailbehaviorsSensorList.map( (data, i) => {
                      return <div key={`addSensor${i}`} className="tr">
                        <div className="td track">
                          <Select
                            /* defaultValue={data.railTrack} */
                            value={ data.railTrack !== 'UNDEFINED' ? data.railTrack : ""}
                            style={{minWidth:"100%"}}
                            onChange={(val)=>{
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].railTrack = val;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                            options={[
                              { value: STRING_UP_TRACK_LEFT, label: trackToString2(STRING_UP_TRACK_LEFT, addRailbehaviorsDisplayName) },
                              { value: STRING_UP_TRACK_RIGHT, label: trackToString2(STRING_UP_TRACK_RIGHT, addRailbehaviorsDisplayName) },
                              { value: STRING_DOWN_TRACK_LEFT, label: trackToString2(STRING_DOWN_TRACK_LEFT, addRailbehaviorsDisplayName) },
                              { value: STRING_DOWN_TRACK_RIGHT, label: trackToString2(STRING_DOWN_TRACK_RIGHT, addRailbehaviorsDisplayName) },
                            ]}
                          />
                        </div>
                        <div className="td kp">
                          <Input value={data.kp} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].kp = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                            placeholder="위치" /> 
                        </div>
                        <div className="td sensorName">
                          <Input value={data.displayName} 
                            onChange={(e)=>{
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].displayName = e.target.value;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="센서명" /> 
                        </div>
                        <div className="td number">
                          <Input value={data.accMax} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].accMax = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="가속도(최대)" /> 
                        </div>
                        <div className="td number">                          
                          <Input value={data.accMin} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].accMin = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="가속도(최소)" />
                        </div>
                        <div className="td number">
                          <Input value={data.stressMin} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].stressMin = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="레일응력(최소)" />
                        </div>
                        <div className="td number">
                          <Input value={data.stress} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].stress = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="레일응력(최대)" />
                        </div>
                        <div className="td number">
                          <Input value={data.wlMax} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].wlMax = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="윤중(최대)" />
                        </div>
                        <div className="td number">
                          <Input value={data.lf} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].lf = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="횡압" />
                        </div>
                        <div className="td number">
                          <Input value={data.vd} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].vd = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="수직변위" />
                        </div>
                        <div className="td number">
                          <Input value={data.hd} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].hd = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="수평변위" />
                        </div>
                        <div className="td number">
                          <Input value={data.speed} 
                            onChange={(e)=>{
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              const newList = [...addRailbehaviorsSensorList];
                              newList[i].speed = numericValue;
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          placeholder="속도" />
                        </div>
                        <div className="td del">
                          <Button danger 
                            onClick={()=>{
                              const newList = [...addRailbehaviorsSensorList];
                              newList.splice(i, 1);
                              setAddRailbehaviorsSensorList(newList);
                            }}
                          icon={<DeleteOutlined />}></Button>
                        </div>
                      </div>
                    } )}
                    <Button type="primary" style={{width:"100%", marginTop : "10px"}} 
                      onClick={()=>{
                        const newList = [...addRailbehaviorsSensorList];
                        newList.push({      
                          "railTrack": "",
                          "kp": 0,
                          "accMax": "",
                          "accMin": "",
                          "stressMin": "",
                          "stress": "",
                          "wlMax": "",
                          "lf": "",
                          "vd": "",
                          "hd": "",
                          "speed": ""
                        });
                        setAddRailbehaviorsSensorList(newList);
                      }}
                      icon={<PlusCircleOutlined />}>
                      센서추가
                    </Button>
                  </div>
                </div>
            </div>
          </div>
        </Modal>

        <Modal
          /* title="Vertically centered modal dialog" */
          centered
          open={viewOpen}
          onCancel={() => setViewOpen(false)}
          width={1600}
          className="dataUploadPopup"
          footer={""}
        >
          <div className="popupTitle"><img src={PopupIcon} />측정세트 상세보기</div>
          <div className="tabPanel" style={{width:"100%"}}>
            <div className="inputLine">
              <div className="inputTitle">노선</div>
              <div className="inputValue">    
                {railbehaviorsRoute}
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정지점이름</div>
              <div className="inputValue">
                {railbehaviorsViewData.displayName}
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">계측구분</div>
              <div className="inputValue">
                {measureTypeText(railbehaviorsViewData.measureType)}계측
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정기간</div>
              <div className="inputValue">
                {formatDateTime(new Date(railbehaviorsViewData.beginTs))} ~ {formatDateTime(new Date(railbehaviorsViewData.endTs))}
              </div>
            </div>
            <div className="inputLine">
              <div className="inputTitle">측정구간</div>
              <div className="inputValue">
                <div className="valueName">{trackToString(STRING_UP_TRACK, railbehaviorsRoute)}</div> {railbehaviorsViewData.t2Begin} ~ {railbehaviorsViewData.t2End}
                <div className="valueName">{trackToString(STRING_DOWN_TRACK, railbehaviorsRoute)}</div> {railbehaviorsViewData.t1Begin} ~ {railbehaviorsViewData.t1Begin}
              </div>
            </div>
            <div className="devisionLine"></div>
            <div className="dataList">
                <div className="customTable2">
                  <div className="theader">
                    <div className="tr">
                      <div className="td">레일구분</div>
                      <div className="td">위치</div>
                      <div className="td">센서명</div>
                      <div className="td">가속도(최대)</div>
                      <div className="td">가속도(최소)</div>
                      <div className="td">레일응력(최소)</div>
                      <div className="td">레일응력(최대)</div>
                      <div className="td">윤중(최대)</div>
                      <div className="td">횡압</div>
                      <div className="td">수직변위</div>
                      <div className="td">수평변위</div>
                      <div className="td">속도</div>
                    </div>
                  </div>
                  <div className="tbody scroll">
                    {railbehaviorsViewData?.sensors?.map( data => {
                      return <div className="tr">
                        <div className="td">{trackToString2(data.railTrack, railbehaviorsRoute)}</div>
                        <div className="td">{data.kp}</div>
                        <div className="td">{data.displayName}</div>
                        <div className="td">{data.accMax}</div>
                        <div className="td">{data.accMin}</div>
                        <div className="td">{data.stressMin}</div>
                        <div className="td">{data.stress}</div>
                        <div className="td">{data.wlMax}</div>
                        <div className="td">{data.lf}</div>
                        <div className="td">{data.vd}</div>
                        <div className="td">{data.hd}</div>
                        <div className="td">{data.speed}</div>
                      </div>
                    } )}
                  </div>
                </div>
            </div>
          </div>
        </Modal>

      </div>
  );
}

export default DataUpload;
