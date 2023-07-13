import "./dataUpload.css";
import ListIcon from "../../assets/icon/list.png";
import UploadIcon from "../../assets/icon/216485_upload_icon_w.png";
import DownloadIcon from "../../assets/icon/download_w.png";
import { useState } from "react";
import classNames from "classnames";

const data ={
  1 : [{"upload" : "2023-05-13 11:27:57", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
       {"upload" : "2023-03-23 14:54:36", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
       {"upload" : "2023-02-07 22:25:47", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
       {"upload" : "2023-01-13 20:35:12", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
       {"upload" : "2022-12-23 20:12:22", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
       {"upload" : "2023-07-16 17:02:53", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"}],
  2 : [
  {"upload" : "2023-07-13 11:27:57", "member" : "Admin", "file" : "20230713112757_통과톤수_데이터.xlsx"},
  {"upload" : "2023-06-30 14:54:26", "member" : "Admin", "file" : "20230630145426_통과톤수_데이터.xlsx"},
  {"upload" : "2023-05-06 21:24:47", "member" : "Admin", "file" : "20230506212447_통과톤수_데이터.xlsx"},
  {"upload" : "2023-01-22 12:36:12", "member" : "Admin", "file" : "20230122123612_통과톤수_데이터.xlsx"},
  {"upload" : "2022-12-13 15:15:36", "member" : "Admin", "file" : "20221213151536_통과톤수_데이터.xlsx"},
  {"upload" : "2022-07-07 15:02:53", "member" : "Admin", "file" : "20220707150253_통과톤수_데이터.xlsx"}],
  3 : [
  {"upload" : "2023-03-13 12:25:12", "member" : "Admin", "file" : "20230313122512_궤도측정_데이터.xlsx"},
  {"upload" : "2023-02-19 14:42:59", "member" : "Admin", "file" : "20230219144259_궤도측정_데이터.xlsx"},
  {"upload" : "2023-01-29 17:32:47", "member" : "Admin", "file" : "20230129173247_궤도측정_데이터.xlsx"},
  {"upload" : "2023-01-05 16:51:13", "member" : "Admin", "file" : "20230105165113_궤도측정_데이터.xlsx"},
  {"upload" : "2022-12-13 12:12:48", "member" : "Admin", "file" : "20221213121248_궤도측정_데이터.xlsx"},
  {"upload" : "2023-07-23 17:33:53", "member" : "Admin", "file" : "20230723173353_궤도측정_데이터.xlsx"}
  ],
  4 : [
  {"upload" : "2023-05-13 11:27:57", "member" : "Admin", "file" : "20230513112757_궤도계측_데이터.png"},
  {"upload" : "2023-03-13 14:54:36", "member" : "Admin", "file" : "20230313145436_궤도계측_데이터.png"},
  {"upload" : "2023-02-13 22:25:47", "member" : "Admin", "file" : "20230213222547_궤도계측_데이터.png"},
  {"upload" : "2023-01-13 20:35:12", "member" : "Admin", "file" : "20230113203512_궤도계측_데이터.png"},
  {"upload" : "2022-12-13 20:12:22", "member" : "Admin", "file" : "20221213201222_궤도계측_데이터.png"},
  {"upload" : "2023-07-13 17:02:53", "member" : "Admin", "file" : "20230713170253_궤도계측_데이터.png"}],
  5 : [
  {"upload" : "2023-05-13 11:27:57", "member" : "Admin", "file" : "20230513112757_프로파일_데이터.xlsx"},
  {"upload" : "2023-03-13 14:54:36", "member" : "Admin", "file" : "20230313145436_프로파일_데이터.xlsx"},
  {"upload" : "2023-02-13 22:25:47", "member" : "Admin", "file" : "20230213222547_프로파일_데이터.xlsx"},
  {"upload" : "2023-01-13 20:35:12", "member" : "Admin", "file" : "20230113203512_프로파일_데이터.xlsx"},
  {"upload" : "2022-12-13 20:12:22", "member" : "Admin", "file" : "20221213201222_프로파일_데이터.xlsx"},
  {"upload" : "2023-07-13 17:02:53", "member" : "Admin", "file" : "20230713170253_프로파일_데이터.xlsx"}],
  6 : [
  {"upload" : "2023-05-13 11:27:57", "member" : "Admin", "file" : "20230513112757_직진도_데이터.xlsx"},
  {"upload" : "2023-03-13 14:54:36", "member" : "Admin", "file" : "20230313145436_직진도_데이터.xlsx"},
  {"upload" : "2023-02-13 22:25:47", "member" : "Admin", "file" : "20230213222547_직진도_데이터.xlsx"},
  {"upload" : "2023-01-13 20:35:12", "member" : "Admin", "file" : "20230113203512_직진도_데이터.xlsx"},
  {"upload" : "2022-12-13 20:12:22", "member" : "Admin", "file" : "20221213201222_직진도_데이터.xlsx"},
  {"upload" : "2023-07-13 17:02:53", "member" : "Admin", "file" : "20230713170253_직진도_데이터.xlsx"}],
  7 : [
  {"upload" : "2023-05-13 11:27:57", "member" : "Admin", "file" : "20230513112757_레일조도_데이터.xlsx"},
  {"upload" : "2023-03-13 14:54:36", "member" : "Admin", "file" : "20230313145436_레일조도_데이터.xlsx"},
  {"upload" : "2023-02-13 22:25:47", "member" : "Admin", "file" : "20230213222547_레일조도_데이터.xlsx"},
  {"upload" : "2023-01-13 20:35:12", "member" : "Admin", "file" : "20230113203512_레일조도_데이터.xlsx"},
  {"upload" : "2022-12-13 20:12:22", "member" : "Admin", "file" : "20221213201222_레일조도_데이터.xlsx"},
  {"upload" : "2023-07-13 17:02:53", "member" : "Admin", "file" : "20230713170253_레일조도_데이터.xlsx"}],
}

function DataUpload( props ) {
  const [ trList, setTrList ] = useState(data[1]);
  const [ active, setActive ] = useState(1);
  const activeChange = ( number ) => {
    setActive(number);
    setTrList(data[number]);
  }

  return (
      <div className="dataUpload">
        <div className="uploadMenu">
          <div className="title"><img src={ListIcon} />데이터 관리 목록</div>
          <div className="line"></div>
          <div className={ classNames("menu", { "active" : active === 1 })} onClick={()=>activeChange(1)} >선로열람도</div>
          <div className={ classNames("menu", { "active" : active === 2 })} onClick={()=>activeChange(2)} >통과톤수</div>
          <div className={ classNames("menu", { "active" : active === 3 })} onClick={()=>activeChange(3)} >궤도측정</div>
          <div className={ classNames("menu", { "active" : active === 4 })} onClick={()=>activeChange(4)} >궤도계측</div>
          <div className={ classNames("menu", { "active" : active === 5 })} onClick={()=>activeChange(5)} >프로파일</div>
          <div className={ classNames("menu", { "active" : active === 6 })} onClick={()=>activeChange(6)} >직진도</div>
          <div className={ classNames("menu", { "active" : active === 7 })} onClick={()=>activeChange(7)} >레일조도</div>
        </div>
        <div className="uploadHistory">
          <div className="title">선로열람도</div>
          <div className="uploadBtn"><img src={UploadIcon}/>Upload</div>
          <div className="table3">
            <div className="tableHeader">
              <div className="tr">
                <div className="td no">No.</div>
                <div className="td upload">업로드 날짜</div>
                <div className="td member">회원명</div>
                <div className="td file">파일명</div>
                <div className="td download"></div>
              </div>
            </div>
            <div className="tableBody">
              {
                trList.map( (tr, i) => {
                  return <div className="tr" key={i}>
                  <div className="td no">{i+1}</div>
                  <div className="td upload">{tr.upload}</div>
                  <div className="td member">{tr.member}</div>
                  <div className="td file">{tr.file}</div>
                  <div className="td download"><div className="donwloadBtn"><img src={DownloadIcon} />다운로드</div></div>
                </div>

                } )
              }
            </div>
          </div>
        </div>
      </div>
  );
}

export default DataUpload;
