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
import { convertBytesToMB, curPagingCheck, curPagingText, flattenTreeData, formatDateTime, getRoute, uploadState, uploadStateBtn } from "../../util";
import { useRef } from "react";
import { Input, Select } from "antd";
import { UPLOAD_CATEGORY_ACCUMULATEWEIGHTS, UPLOAD_CATEGORY_RAILBEHAVIORS, UPLOAD_CATEGORY_RAILPROFILES, UPLOAD_CATEGORY_RAILROUGHNESS, UPLOAD_CATEGORY_RAILSTRAIGHTS, UPLOAD_CATEGORY_RAILTWISTS, UPLOAD_CATEGORY_RAILWEARS, UPLOAD_CATEGORY_TEMPERATURES, UPLOAD_STATE_APPLYING, UPLOAD_STATE_APPLY_FAIL, UPLOAD_STATE_APPLY_SUCCESS, UPLOAD_STATE_CONVERTING, UPLOAD_STATE_CONVERT_FAIL, UPLOAD_STATE_CONVERT_SUCCESS, UPLOAD_STATE_UPLOADED } from "../../constant";

let route = getRoute();
let interval = null;
function DataUpload( props ) {
  const hiddenFileInput = useRef(null);
  const [ trList, setTrList ] = useState([]);
  const [ active, setActive ] = useState(UPLOAD_CATEGORY_ACCUMULATEWEIGHTS);
  const [ totalCnt, setTotalCnt ] = useState(0);
  const [ showrows, setShowrows ] = useState(25);
  const [ curPage, setCurPage ] = useState(1);
  const [ dataCnt, setDataCnt ] = useState(0);
  const [ dataSize, setDataSize ] = useState(0);
  const [ weekDataCnt, setWeekDataCnt ] = useState(0);
  const [ weekDataSize, setWeekDataSize ] = useState(0);

  const activeChange = ( category ) => {
    setActive(category);
    getList(category);
    getDataStatistics(category);
    clearInterval(interval);
    interval = setInterval(() => {
      getList(category);
    }, 5000);
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
          <div className={ classNames("menu", { "active" : active === UPLOAD_CATEGORY_TEMPERATURES })} onClick={()=>activeChange(UPLOAD_CATEGORY_TEMPERATURES)} >온습도</div>
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
      </div>
  );
}

export default DataUpload;
