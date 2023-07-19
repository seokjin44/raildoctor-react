import "./railProfile.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import PositionImg from "../../assets/position2.png";
//import Radio from '@mui/joy/Radio';
//import RadioGroup from '@mui/joy/RadioGroup';
import LeftProfile from "../../assets/left_profile.png"; 
import RightProfile from "../../assets/right_profile.png"; 
import Slider from '@mui/material/Slider';

import Box from '@mui/material/Box';
import ChartAuto from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import faker from 'faker';
import { RANGEPICKERSTYLE } from "../../constant";
import { Input, DatePicker, Radio } from "antd";
import { RadioGroup } from "@mui/material";
const { RangePicker } = DatePicker;

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];

export const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Dataset 1',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
    {
      type: 'line',
      label: 'Dataset 2',
      backgroundColor: 'rgb(75, 192, 192)',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'white',
      borderWidth: 2,
    },
    {
      type: 'line',
      label: 'Dataset 3',
      backgroundColor: 'rgb(53, 162, 235)',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
  ],
};

const marks = [
  {
    value: 0,
    label: '10/05',
  },
  {
    value: 20,
    label: '11/23',
  },
  {
    value: 37,
    label: '12/04',
  },
  {
    value: 100,
    label: '12/26',
  },
];

const railroadSection = [
  {
    "id": 2,
    "start_station_id": 2,
    "end_station_id": 3,
    "railroad_id": 0,
    "start_station_name": "계양",
    "end_station_name": "귤현",
    "start_station_up_track_location": 0,
    "start_station_down_track_location": 0,
    "end_station_up_track_location": 900,
    "end_station_down_track_location": 900,
    "start_station_longitude": "126.736411",
    "start_station_latitude": "37.5714532",
    "end_station_longitude": "126.7424923",
    "end_station_latitude": "37.5666362"
  },
  {
    "id": 4,
    "start_station_id": 3,
    "end_station_id": 4,
    "railroad_id": 0,
    "start_station_name": "귤현",
    "end_station_name": "박촌",
    "start_station_up_track_location": 900,
    "start_station_down_track_location": 900,
    "end_station_up_track_location": 2400,
    "end_station_down_track_location": 2400,
    "start_station_longitude": "126.7424923",
    "start_station_latitude": "37.5666362",
    "end_station_longitude": "126.7449949",
    "end_station_latitude": "37.553537"
  },
  {
    "id": 5,
    "start_station_id": 4,
    "end_station_id": 5,
    "railroad_id": 0,
    "start_station_name": "박촌",
    "end_station_name": "임학",
    "start_station_up_track_location": 2400,
    "start_station_down_track_location": 2400,
    "end_station_up_track_location": 3500,
    "end_station_down_track_location": 3500,
    "start_station_longitude": "126.7449949",
    "start_station_latitude": "37.553537",
    "end_station_longitude": "126.738672",
    "end_station_latitude": "37.5450986"
  },
  {
    "id": 6,
    "start_station_id": 5,
    "end_station_id": 6,
    "railroad_id": 0,
    "start_station_name": "임학",
    "end_station_name": "계산",
    "start_station_up_track_location": 3500,
    "start_station_down_track_location": 3500,
    "end_station_up_track_location": 4600,
    "end_station_down_track_location": 4600,
    "start_station_longitude": "126.738672",
    "start_station_latitude": "37.5450986",
    "end_station_longitude": "126.7281452",
    "end_station_latitude": "37.5433016"
  },
  {
    "id": 7,
    "start_station_id": 6,
    "end_station_id": 7,
    "railroad_id": 0,
    "start_station_name": "계산",
    "end_station_name": "경인교대입구",
    "start_station_up_track_location": 4600,
    "start_station_down_track_location": 4600,
    "end_station_up_track_location": 5500,
    "end_station_down_track_location": 5500,
    "start_station_longitude": "126.7281452",
    "start_station_latitude": "37.5433016",
    "end_station_longitude": "126.7226228",
    "end_station_latitude": "37.5381803"
  },
  {
    "id": 8,
    "start_station_id": 7,
    "end_station_id": 8,
    "railroad_id": 0,
    "start_station_name": "경인교대입구",
    "end_station_name": "작전",
    "start_station_up_track_location": 5500,
    "start_station_down_track_location": 5500,
    "end_station_up_track_location": 6400,
    "end_station_down_track_location": 6400,
    "start_station_longitude": "126.7226228",
    "start_station_latitude": "37.5381803",
    "end_station_longitude": "126.7225326",
    "end_station_latitude": "37.530291"
  },
  {
    "id": 9,
    "start_station_id": 8,
    "end_station_id": 9,
    "railroad_id": 0,
    "start_station_name": "작전",
    "end_station_name": "갈산",
    "start_station_up_track_location": 6400,
    "start_station_down_track_location": 6400,
    "end_station_up_track_location": 7800,
    "end_station_down_track_location": 7800,
    "start_station_longitude": "126.7225326",
    "start_station_latitude": "37.530291",
    "end_station_longitude": "126.7215587",
    "end_station_latitude": "37.5170688"
  },
  {
    "id": 10,
    "start_station_id": 9,
    "end_station_id": 10,
    "railroad_id": 0,
    "start_station_name": "갈산",
    "end_station_name": "부평구청",
    "start_station_up_track_location": 7800,
    "start_station_down_track_location": 7800,
    "end_station_up_track_location": 8800,
    "end_station_down_track_location": 8800,
    "start_station_longitude": "126.7215587",
    "start_station_latitude": "37.5170688",
    "end_station_longitude": "126.7205867",
    "end_station_latitude": "37.5084365"
  },
  {
    "id": 11,
    "start_station_id": 10,
    "end_station_id": 11,
    "railroad_id": 0,
    "start_station_name": "부평구청",
    "end_station_name": "부평시장",
    "start_station_up_track_location": 8800,
    "start_station_down_track_location": 8800,
    "end_station_up_track_location": 9900,
    "end_station_down_track_location": 9900,
    "start_station_longitude": "126.7205867",
    "start_station_latitude": "37.5084365",
    "end_station_longitude": "126.7222774",
    "end_station_latitude": "37.4984557"
  },
  {
    "id": 12,
    "start_station_id": 11,
    "end_station_id": 12,
    "railroad_id": 0,
    "start_station_name": "부평시장",
    "end_station_name": "부평",
    "start_station_up_track_location": 9900,
    "start_station_down_track_location": 9900,
    "end_station_up_track_location": 10800,
    "end_station_down_track_location": 10800,
    "start_station_longitude": "126.7222774",
    "start_station_latitude": "37.4984557",
    "end_station_longitude": "126.7234918",
    "end_station_latitude": "37.4904123"
  },
  {
    "id": 13,
    "start_station_id": 12,
    "end_station_id": 13,
    "railroad_id": 0,
    "start_station_name": "부평",
    "end_station_name": "동수",
    "start_station_up_track_location": 10800,
    "start_station_down_track_location": 10800,
    "end_station_up_track_location": 11700,
    "end_station_down_track_location": 11700,
    "start_station_longitude": "126.7234918",
    "start_station_latitude": "37.4904123",
    "end_station_longitude": "126.718399",
    "end_station_latitude": "37.4854209"
  },
  {
    "id": 14,
    "start_station_id": 13,
    "end_station_id": 14,
    "railroad_id": 0,
    "start_station_name": "동수",
    "end_station_name": "부평삼거리",
    "start_station_up_track_location": 11700,
    "start_station_down_track_location": 11700,
    "end_station_up_track_location": 12800,
    "end_station_down_track_location": 12800,
    "start_station_longitude": "126.718399",
    "start_station_latitude": "37.4854209",
    "end_station_longitude": "126.7104676",
    "end_station_latitude": "37.4782817"
  },
  {
    "id": 15,
    "start_station_id": 14,
    "end_station_id": 15,
    "railroad_id": 0,
    "start_station_name": "부평삼거리",
    "end_station_name": "간석오거리",
    "start_station_up_track_location": 12800,
    "start_station_down_track_location": 12800,
    "end_station_up_track_location": 14000,
    "end_station_down_track_location": 14000,
    "start_station_longitude": "126.7104676",
    "start_station_latitude": "37.4782817",
    "end_station_longitude": "126.7079019",
    "end_station_latitude": "37.4669093"
  },
  {
    "id": 16,
    "start_station_id": 15,
    "end_station_id": 16,
    "railroad_id": 0,
    "start_station_name": "간석오거리",
    "end_station_name": "인천시청",
    "start_station_up_track_location": 14000,
    "start_station_down_track_location": 14000,
    "end_station_up_track_location": 15400,
    "end_station_down_track_location": 15400,
    "start_station_longitude": "126.7079019",
    "start_station_latitude": "37.4669093",
    "end_station_longitude": "126.7022161",
    "end_station_latitude": "37.4576187"
  },
  {
    "id": 17,
    "start_station_id": 16,
    "end_station_id": 17,
    "railroad_id": 0,
    "start_station_name": "인천시청",
    "end_station_name": "예술회관",
    "start_station_up_track_location": 15400,
    "start_station_down_track_location": 15400,
    "end_station_up_track_location": 16400,
    "end_station_down_track_location": 16400,
    "start_station_longitude": "126.7022161",
    "start_station_latitude": "37.4576187",
    "end_station_longitude": "126.7010064",
    "end_station_latitude": "37.4492006"
  },
  {
    "id": 18,
    "start_station_id": 17,
    "end_station_id": 18,
    "railroad_id": 0,
    "start_station_name": "예술회관",
    "end_station_name": "인천터미널",
    "start_station_up_track_location": 16400,
    "start_station_down_track_location": 16400,
    "end_station_up_track_location": 17200,
    "end_station_down_track_location": 17200,
    "start_station_longitude": "126.7010064",
    "start_station_latitude": "37.4492006",
    "end_station_longitude": "126.699675",
    "end_station_latitude": "37.4419043"
  },
  {
    "id": 19,
    "start_station_id": 18,
    "end_station_id": 19,
    "railroad_id": 0,
    "start_station_name": "인천터미널",
    "end_station_name": "문학경기장",
    "start_station_up_track_location": 17200,
    "start_station_down_track_location": 17200,
    "end_station_up_track_location": 18000,
    "end_station_down_track_location": 18000,
    "start_station_longitude": "126.699675",
    "start_station_latitude": "37.4419043",
    "end_station_longitude": "126.6983415",
    "end_station_latitude": "37.4349599"
  },
  {
    "id": 20,
    "start_station_id": 19,
    "end_station_id": 20,
    "railroad_id": 0,
    "start_station_name": "문학경기장",
    "end_station_name": "선학",
    "start_station_up_track_location": 18000,
    "start_station_down_track_location": 18000,
    "end_station_up_track_location": 18800,
    "end_station_down_track_location": 18800,
    "start_station_longitude": "126.6983415",
    "start_station_latitude": "37.4349599",
    "end_station_longitude": "126.6989247",
    "end_station_latitude": "37.427001"
  },
  {
    "id": 21,
    "start_station_id": 20,
    "end_station_id": 21,
    "railroad_id": 0,
    "start_station_name": "선학",
    "end_station_name": "신연수",
    "start_station_up_track_location": 18800,
    "start_station_down_track_location": 18800,
    "end_station_up_track_location": 19900,
    "end_station_down_track_location": 19900,
    "start_station_longitude": "126.6989247",
    "start_station_latitude": "37.427001",
    "end_station_longitude": "126.6940278",
    "end_station_latitude": "37.4180588"
  },
  {
    "id": 22,
    "start_station_id": 21,
    "end_station_id": 22,
    "railroad_id": 0,
    "start_station_name": "신연수",
    "end_station_name": "원인재",
    "start_station_up_track_location": 19900,
    "start_station_down_track_location": 19900,
    "end_station_up_track_location": 20800,
    "end_station_down_track_location": 20800,
    "start_station_longitude": "126.6940278",
    "start_station_latitude": "37.4180588",
    "end_station_longitude": "126.6878251",
    "end_station_latitude": "37.4123326"
  },
  {
    "id": 23,
    "start_station_id": 22,
    "end_station_id": 23,
    "railroad_id": 0,
    "start_station_name": "원인재",
    "end_station_name": "동춘",
    "start_station_up_track_location": 20800,
    "start_station_down_track_location": 20800,
    "end_station_up_track_location": 21900,
    "end_station_down_track_location": 21900,
    "start_station_longitude": "126.6878251",
    "start_station_latitude": "37.4123326",
    "end_station_longitude": "126.680786",
    "end_station_latitude": "37.4047322"
  },
  {
    "id": 24,
    "start_station_id": 23,
    "end_station_id": 24,
    "railroad_id": 0,
    "start_station_name": "동춘",
    "end_station_name": "동막",
    "start_station_up_track_location": 21900,
    "start_station_down_track_location": 21900,
    "end_station_up_track_location": 22900,
    "end_station_down_track_location": 22900,
    "start_station_longitude": "126.680786",
    "start_station_latitude": "37.4047322",
    "end_station_longitude": "126.6736029",
    "end_station_latitude": "37.3981396"
  },
  {
    "id": 25,
    "start_station_id": 24,
    "end_station_id": 25,
    "railroad_id": 0,
    "start_station_name": "동막",
    "end_station_name": "캠퍼스타운",
    "start_station_up_track_location": 22900,
    "start_station_down_track_location": 22900,
    "end_station_up_track_location": 24500,
    "end_station_down_track_location": 24500,
    "start_station_longitude": "126.6736029",
    "start_station_latitude": "37.3981396",
    "end_station_longitude": "126.6620847",
    "end_station_latitude": "37.3882047"
  },
  {
    "id": 26,
    "start_station_id": 25,
    "end_station_id": 26,
    "railroad_id": 0,
    "start_station_name": "캠퍼스타운",
    "end_station_name": "테크노파크",
    "start_station_up_track_location": 24500,
    "start_station_down_track_location": 24500,
    "end_station_up_track_location": 25300,
    "end_station_down_track_location": 25300,
    "start_station_longitude": "126.6620847",
    "start_station_latitude": "37.3882047",
    "end_station_longitude": "126.6561887",
    "end_station_latitude": "37.3820787"
  },
  {
    "id": 27,
    "start_station_id": 26,
    "end_station_id": 27,
    "railroad_id": 0,
    "start_station_name": "테크노파크",
    "end_station_name": "지식정보단지",
    "start_station_up_track_location": 25300,
    "start_station_down_track_location": 25300,
    "end_station_up_track_location": 26700,
    "end_station_down_track_location": 26700,
    "start_station_longitude": "126.6561887",
    "start_station_latitude": "37.3820787",
    "end_station_longitude": "126.6454262",
    "end_station_latitude": "37.378017"
  },
  {
    "id": 28,
    "start_station_id": 27,
    "end_station_id": 28,
    "railroad_id": 0,
    "start_station_name": "지식정보단지",
    "end_station_name": "인천대입구",
    "start_station_up_track_location": 26700,
    "start_station_down_track_location": 26700,
    "end_station_up_track_location": 27700,
    "end_station_down_track_location": 27700,
    "start_station_longitude": "126.6454262",
    "start_station_latitude": "37.378017",
    "end_station_longitude": "126.6394183",
    "end_station_latitude": "37.386209"
  },
  {
    "id": 29,
    "start_station_id": 28,
    "end_station_id": 29,
    "railroad_id": 0,
    "start_station_name": "인천대입구",
    "end_station_name": "센트럴파크",
    "start_station_up_track_location": 27700,
    "start_station_down_track_location": 27700,
    "end_station_up_track_location": 28600,
    "end_station_down_track_location": 28600,
    "start_station_longitude": "126.6394183",
    "start_station_latitude": "37.386209",
    "end_station_longitude": "126.6349838",
    "end_station_latitude": "37.3928199"
  },
  {
    "id": 30,
    "start_station_id": 29,
    "end_station_id": 30,
    "railroad_id": 0,
    "start_station_name": "센트럴파크",
    "end_station_name": "국제업무지구",
    "start_station_up_track_location": 28600,
    "start_station_down_track_location": 28600,
    "end_station_up_track_location": 29400,
    "end_station_down_track_location": 29400,
    "start_station_longitude": "126.6349838",
    "start_station_latitude": "37.3928199",
    "end_station_longitude": "126.630119",
    "end_station_latitude": "37.4004344"
  },
  {
    "id": 31,
    "start_station_id": 30,
    "end_station_id": 31,
    "railroad_id": 0,
    "start_station_name": "국제업무지구",
    "end_station_name": "송도달빛축제공원",
    "start_station_up_track_location": 29400,
    "start_station_down_track_location": 29400,
    "end_station_up_track_location": 30300,
    "end_station_down_track_location": 30300,
    "start_station_longitude": "126.630119",
    "start_station_latitude": "37.4004344",
    "end_station_longitude": "126.6258733",
    "end_station_latitude": "37.4071408"
  }
]

function RailProfile( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation railProfile" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>Search Navigate</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="date">
                <Radio.Group >
                  <Radio value={1}>상선</Radio>
                  <Radio value={2}>하선</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">검토일자 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                  />
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                </div>
              </div>
            </div>
      </div>
      {/* <div className="contentBox" style={{ height: "220px"}} >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section ">

          <div className="position optionBox borderColorGreen" style={{width: "935px"}} >
            <div className="optionTitle">위치</div>
            <div className="optionValue">
              <img src={PositionImg} />
            </div>
          </div>
          
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

          <div className="position optionBox h75">
            <div className="optionTitle">측정일자</div>
            <div className="optionValue">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker label="측정일"  />
              </LocalizationProvider>
            </div>
          </div>
  
        </div>
      </div> */}

      <div className="contentBox" style={{marginTop:"10px", height: "485px"}}>
        <div className="containerTitle">프로파일 및 마모 데이터</div>
        <div className="componentBox chartBox flex">
          <div className="profile left">
            <div className="profileSlider">
              <img src={LeftProfile} />
              <Slider
                track={false}
                aria-labelledby="track-false-slider"
                /* getAriaValueText={valuetext} */
                defaultValue={30}
                marks={marks}
              />
            </div>
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                  <div className="td mamo rowspan7"><div className="rowspan7">좌레일</div></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo"></div>
                </div>
                <div className="tr">
                  <div className="td measurementDate colspan3"></div>
                  <div className="td mamo rowspan2"><div className="rowspan2">좌측</div></div>
                  <div className="td mamo rowspan2"></div>
                  <div className="td mamo colspan2"><div className="colspan2">직마모(0º)</div></div>
                  <div className="td mamo rowspan2"><div className="rowspan2">우측</div></div>
                  <div className="td mamo rowspan2 "></div>
                  <div className="td mamo">면적</div>
                  <div className="td mamo">마모율</div>
                </div>
                <div className="tr" style={{ height: "45px"}}>
                  <div className="td measurementDate"></div>
                  <div className="td mamo">측마모(-90º)</div>
                  <div className="td mamo">편마모(-45º)</div>
                  <div className="td mamo"></div>
                  <div className="td mamo">측마모(+45º)</div>
                  <div className="td mamo">측마모(+90º)</div>
                  <div className="td mamo">AW(㎟)</div>
                  <div className="td mamo">AWP(%)</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td measurementDate">21.09.16</div>
                  <div className="td mamo">-0.28</div>
                  <div className="td mamo">6.79</div>
                  <div className="td mamo">8.75</div>
                  <div className="td mamo">9.66</div>
                  <div className="td mamo">-0.36</div>
                  <div className="td mamo">534.46</div>
                  <div className="td mamo">19.19</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">22.04.27</div>
                  <div className="td mamo">-0.26</div>
                  <div className="td mamo">7.49</div>
                  <div className="td mamo">9.28</div>
                  <div className="td mamo">10.28</div>
                  <div className="td mamo">-0.29</div>
                  <div className="td mamo">574.87</div>
                  <div className="td mamo">20.64</div>
                </div>

                <div className="tr">
                  <div className="td measurementDate">22.06.24</div>
                  <div className="td mamo">-0.21</div>
                  <div className="td mamo">7.23</div>
                  <div className="td mamo">8.95</div>
                  <div className="td mamo">9.79</div>
                  <div className="td mamo">-0.38</div>
                  <div className="td mamo">552.44</div>
                  <div className="td mamo">19.83</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">23.01.20</div>
                  <div className="td mamo">-0.19</div>
                  <div className="td mamo">8.28</div>
                  <div className="td mamo">9.8</div>
                  <div className="td mamo">10.67</div>
                  <div className="td mamo">-0.32</div>
                  <div className="td mamo">607.96</div>
                  <div className="td mamo">21.81</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">23.03.15</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">10.5</div>
                  <div className="td mamo">11.57</div>
                  <div className="td mamo">-0.35</div>
                  <div className="td mamo">608.55</div>
                  <div className="td mamo">22.78</div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile right">
            <div className="profileSlider">
              <img src={RightProfile} />
              <Slider
                track={false}
                aria-labelledby="track-false-slider"
                /* getAriaValueText={valuetext} */
                defaultValue={30}
                marks={marks}
              />
            </div>
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                  <div className="td mamo rowspan7"><div className="rowspan7">우레일</div></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo rowspan7"></div>
                  <div className="td mamo"></div>
                </div>
                <div className="tr">
                  <div className="td measurementDate colspan3"></div>
                  <div className="td mamo rowspan2"><div className="rowspan2">좌측</div></div>
                  <div className="td mamo rowspan2"></div>
                  <div className="td mamo colspan2"><div className="colspan2">직마모(0º)</div></div>
                  <div className="td mamo rowspan2"><div className="rowspan2">우측</div></div>
                  <div className="td mamo rowspan2 "></div>
                  <div className="td mamo">면적</div>
                  <div className="td mamo">마모율</div>
                </div>
                <div className="tr" style={{ height: "45px"}}>
                  <div className="td measurementDate"></div>
                  <div className="td mamo">측마모(-90º)</div>
                  <div className="td mamo">편마모(-45º)</div>
                  <div className="td mamo"></div>
                  <div className="td mamo">측마모(+45º)</div>
                  <div className="td mamo">측마모(+90º)</div>
                  <div className="td mamo">AW(㎟)</div>
                  <div className="td mamo">AWP(%)</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td measurementDate">21.09.16</div>
                  <div className="td mamo">2.33</div>
                  <div className="td mamo">9.63</div>
                  <div className="td mamo">6.46</div>
                  <div className="td mamo">3.02</div>
                  <div className="td mamo">-0.46</div>
                  <div className="td mamo">439.62</div>
                  <div className="td mamo">15.78</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">22.04.27</div>
                  <div className="td mamo">2.33</div>
                  <div className="td mamo">9.88</div>
                  <div className="td mamo">6.64</div>
                  <div className="td mamo">3.22</div>
                  <div className="td mamo">-0.33</div>
                  <div className="td mamo">455.47</div>
                  <div className="td mamo">16.35</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">22.06.24</div>
                  <div className="td mamo">2.76</div>
                  <div className="td mamo">9.9</div>
                  <div className="td mamo">6.44</div>
                  <div className="td mamo">2.91</div>
                  <div className="td mamo">-0.62</div>
                  <div className="td mamo">445.79</div>
                  <div className="td mamo">16</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">23.01.20</div>
                  <div className="td mamo">2.64</div>
                  <div className="td mamo">10.32</div>
                  <div className="td mamo">6.89</div>
                  <div className="td mamo">3.63</div>
                  <div className="td mamo">-0.56</div>
                  <div className="td mamo">477.08</div>
                  <div className="td mamo">17.12</div>
                </div>
                <div className="tr">
                  <div className="td measurementDate">23.03.15</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                  <div className="td mamo">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RailProfile;
