import { useLocation, useNavigate } from "react-router-dom";
import "./cumulativeThroughput.css";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import CalendarImg from "../../assets/icon/calendar.svg";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';

function CumulativeThroughput( props ) {
  const location = useLocation();
  return (
    <div className="cumulativeThroughput" >
      <div className="contentBox" style={{height:"100px", width : "1180px"}} >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section ">
          <div className="radioButtons optionBox ">
            <RadioGroup defaultValue="outlined" name="radio-buttons-group" 
              orientation="horizontal" 
              size="sm"  
              variant="outlined" style={{border : 0}}
            >
              <Radio value="outlined" label="상선" />
              <Radio value="soft" label="하선" />
            </RadioGroup>

          </div>
          <div className="distanceSearch optionBox">
            <div className="optionTitle">KP</div>
            <input className="local" id="kilometerStart" />
            <div className="textK">K</div>
            <input className="local" id="kilometerEnd"/>
          </div>
          <div className="position optionBox borderColorGreen">
            <div className="optionTitle">위치</div>
            <div className="optionValue">인천터미널 - 문학경기장</div>
          </div>
          <div className="position optionBox borderColorGreen">
            <div className="optionTitle">부설일자</div>
            <div className="optionValue">
              <div className="icon">
                <img src={CalendarImg} />
              </div>
              2023/01/01
            </div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height: "100px"}} >
        <div className="containerTitle">현재 누적통과톤수</div>
        <div className="componentBox flex section ">
          <div className="curDate optionBox borderColorGreen">
            <div className="optionTitle">현재날짜</div>
            <div className="optionValue">2023/07/03</div>
          </div>
          <div className="curDate optionBox borderColorGreen">
            <div className="optionTitle">좌레일</div>
            <div className="optionValue">414,953,971.38</div>
          </div>
          <div className="curDate optionBox borderColorGreen" >
            <div className="optionTitle">우레일</div>
            <div className="optionValue">414,953,971.38</div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height: "300px"}} >
        <div className="containerTitle">검토 누적통과톤수</div>
        <div className="componentBox flex section ">
          <div className="curDate optionBox h75">
            <div className="optionTitle">검토날짜</div>
            <div className="optionValue">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker label="검토일"  />
              </LocalizationProvider>
            </div>
          </div>
          <div className="curDate optionBox h75 borderColorGreen">
            <div className="optionTitle">갱환기준치</div>
            <div className="optionValue">161,591,218.5</div>
          </div>
          <div className="curDate optionBox borderColorGreen">
            <div className="optionTitle">좌레일</div>
            <div className="optionValue">
              <div className="verticalValue">
                <div className="verticalValueBox">
                  <div className="boxTitle">누적통과톤수</div>
                  414,953,971.38
                </div>
                <div className="verticalValueBox">
                  <div className="boxTitle">잔여톤수</div>
                  414,953,971.38
                </div>
                <div className="verticalValueBox">
                  <div className="boxTitle">갱환예측시기</div>
                  414,953,971.38
                </div>
              </div>
            </div>
          </div>
          <div className="curDate optionBox borderColorGreen">
            <div className="optionTitle">우레일</div>
            <div className="optionValue">
              <div className="verticalValue">
                <div className="verticalValueBox">
                  <div className="boxTitle">누적통과톤수</div>
                  414,953,971.38
                </div>
                <div className="verticalValueBox">
                  <div className="boxTitle">잔여톤수</div>
                  414,953,971.38
                </div>
                <div className="verticalValueBox">
                  <div className="boxTitle">갱환예측시기</div>
                  414,953,971.38
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CumulativeThroughput;
