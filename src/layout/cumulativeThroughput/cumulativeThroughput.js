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
import RailStatus from "../../component/railStatus/railStatus";
import { useState } from "react";


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
];

const tableData = [{"topdown":"상선","leftRight":"좌&우","start":"117.306","end":"669.306","after":"552","change":"2007-3-16","regdate":"2021-12-31","value1":"280562738.375","value2":"41915.0739726026","expect":"2042-11-12"},
{"topdown":"상선","leftRight":"좌&우","start":"669.306","end":"1593.675","after":"924.369","change":"2007-3-16","regdate":"2021-12-31","value1":"280813832.995","value2":"42603.0044383561","expect":"2042-07-06"},
{"topdown":"상선","leftRight":"좌&우","start":"1593.675","end":"3149.885","after":"1556.21","change":"1999-10-6","regdate":"2021-12-31","value1":"414247761.4","value2":"42662.7625753424","expect":"2033-12-01"},
{"topdown":"상선","leftRight":"좌&우","start":"3149.885","end":"4223.693","after":"1073.808","change":"1999-10-6","regdate":"2021-12-31","value1":"414283307.54","value2":"42760.1492602739","expect":"2033-11-21"},
{"topdown":"상선","leftRight":"좌&우","start":"4223.693","end":"5334.044","after":"1110.351","change":"1999-10-6","regdate":"2021-12-31","value1":"414331612.86","value2":"42892.4926027396","expect":"2033-11-06"},
{"topdown":"상선","leftRight":"좌&우","start":"5334.044","end":"6225.616","after":"891.572","change":"1999-10-6","regdate":"2021-12-31","value1":"414437600.28","value2":"43182.8690958903","expect":"2033-10-06"},
{"topdown":"상선","leftRight":"좌&우","start":"6225.616","end":"7135.616","after":"910","change":"1999-10-6","regdate":"2021-12-31","value1":"414513394.25","value2":"43390.5238082191","expect":"2033-09-13"},
{"topdown":"상선","leftRight":"좌&우","start":"7135.616","end":"8576.31","after":"1440.694","change":"1999-10-6","regdate":"2021-12-31","value1":"414693044.91","value2":"43882.7173972602","expect":"2033-07-23"},
{"topdown":"상선","leftRight":"좌&우","start":"8576.31","end":"9546.311","after":"970.001","change":"1999-10-6","regdate":"2021-12-31","value1":"414795842.71","value2":"44164.3552054794","expect":"2033-06-24"},
{"topdown":"상선","leftRight":"좌&우","start":"9546.311","end":"10681.296","after":"1134.985","change":"1999-10-6","regdate":"2021-12-31","value1":"414737004.14","value2":"44003.1536438355","expect":"2033-07-11"},
{"topdown":"상선","leftRight":"좌&우","start":"10681.296","end":"11573.082","after":"891.786","change":"1999-10-6","regdate":"2021-12-31","value1":"414815071.5","value2":"44217.0368219177","expect":"2033-06-19"},
{"topdown":"상선","leftRight":"좌&우","start":"11573.082","end":"12431.845","after":"858.762999999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414957109.06","value2":"44606.1808219177","expect":"2033-05-10"},
{"topdown":"상선","leftRight":"좌&우","start":"12431.845","end":"13554.793","after":"1122.948","change":"1999-10-6","regdate":"2021-12-31","value1":"414965630.86","value2":"44629.528219178","expect":"2033-05-08"},
{"topdown":"상선","leftRight":"좌&우","start":"13554.793","end":"14766.533","after":"1211.74","change":"1999-10-6","regdate":"2021-12-31","value1":"414953971.38","value2":"44597.5844383561","expect":"2033-05-11"},
{"topdown":"상선","leftRight":"좌&우","start":"14766.533","end":"16127.1145","after":"1360.5815","change":"1999-10-6","regdate":"2021-12-31","value1":"414949917.12","value2":"44586.4768767122","expect":"2033-05-12"},
{"topdown":"상선","leftRight":"좌&우","start":"16127.1145","end":"17112.9725","after":"985.858","change":"1999-10-6","regdate":"2021-12-31","value1":"415081547.29","value2":"44947.107479452","expect":"2033-04-06"},
{"topdown":"상선","leftRight":"좌&우","start":"17112.9725","end":"17923.053","after":"810.0805","change":"1999-10-6","regdate":"2021-12-31","value1":"415006588.63","value2":"44741.7412876711","expect":"2033-04-26"},
{"topdown":"상선","leftRight":"좌&우","start":"17923.053","end":"18732.4415","after":"809.388500000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414917842.28","value2":"44498.6006027396","expect":"2033-05-21"},
{"topdown":"상선","leftRight":"좌&우","start":"18732.4415","end":"19570.7635","after":"838.322","change":"1999-10-6","regdate":"2021-12-31","value1":"414909636.6","value2":"44476.1192876711","expect":"2033-05-23"},
{"topdown":"상선","leftRight":"좌&우","start":"19570.7635","end":"20709.892","after":"1139.1285","change":"1999-10-6","regdate":"2021-12-31","value1":"414866286.79","value2":"44357.3526849314","expect":"2033-06-04"},
{"topdown":"상선","leftRight":"좌&우","start":"20709.892","end":"21580.7335","after":"870.841499999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414814385.15","value2":"44215.1564109588","expect":"2033-06-19"},
{"topdown":"상선","leftRight":"좌&우","start":"21580.7335","end":"22630.636","after":"1049.9025","change":"1999-10-6","regdate":"2021-12-31","value1":"414753047.86","value2":"44047.1090410958","expect":"2033-07-06"},
{"topdown":"상선","leftRight":"좌&우","start":"22630.636","end":"23630.79","after":"1000.154","change":"1999-10-6","regdate":"2021-12-31","value1":"414607854.91","value2":"43649.3201369862","expect":"2033-08-17"},
{"topdown":"상선","leftRight":"좌&우","start":"23630.79","end":"24230.023","after":"599.233","change":"1999-10-6","regdate":"2021-12-31","value1":"414527551.12","value2":"43429.3097534246","expect":"2033-09-09"},
{"topdown":"상선","leftRight":"좌&우","start":"24230.023","end":"25170.016","after":"939.992999999999","change":"2009-6-1","regdate":"2021-12-31","value1":"243908021.225","value2":"43429.3097534246","expect":"2044-06-12"},
{"topdown":"상선","leftRight":"좌&우","start":"25170.016","end":"25989.807","after":"819.791000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243831524.245","value2":"43219.7289863013","expect":"2044-07-23"},
{"topdown":"상선","leftRight":"좌&우","start":"25989.807","end":"27410.884","after":"1421.077","change":"2009-6-1","regdate":"2021-12-31","value1":"243677018.495","value2":"42796.4255616437","expect":"2044-10-16"},
{"topdown":"상선","leftRight":"좌&우","start":"27410.884","end":"28401.186","after":"990.302000000003","change":"2009-6-1","regdate":"2021-12-31","value1":"243608815.045","value2":"42609.5667945205","expect":"2044-11-24"},
{"topdown":"상선","leftRight":"좌&우","start":"28401.186","end":"29290.964","after":"889.777999999998","change":"2009-6-1","regdate":"2021-12-31","value1":"243515012.035","value2":"42352.5722465752","expect":"2045-01-16"},
{"topdown":"상선","leftRight":"좌&우","start":"29290.964","end":"30111.031","after":"820.066999999999","change":"2009-6-1","regdate":"2021-12-31","value1":"243450711.365","value2":"42176.4060273972","expect":"2045-02-21"},
{"topdown":"상선","leftRight":"좌&우","start":"30111.031","end":"30775.031","after":"664","change":"2009-6-1","regdate":"2021-12-31","value1":"243429754.765","value2":"42118.9906849313","expect":"2045-03-05"},
{"topdown":"상선","leftRight":"좌&우","start":"30775.031","end":"31064","after":"288.969000000001","change":"2020-12-12","regdate":"2021-12-31","value1":"16052054.49","value2":"42118.9906849313","expect":"2059-12-16"},
{"topdown":"상선","leftRight":"좌&우","start":"31064","end":"31602.489","after":"538.489000000001","change":"2020-12-12","regdate":"2021-12-31","value1":"15975613.9999999","value2":"41915.0739726026","expect":"2060-02-23"},
{"topdown":"하선","leftRight":"좌&우","start":"172.199","end":"664.199","after":"492","change":"2007-3-16","regdate":"2021-12-31","value1":"280562738.375","value2":"41915.0739726026","expect":"2042-11-12"},
{"topdown":"하선","leftRight":"좌&우","start":"664.199","end":"1583.936","after":"919.737","change":"2007-3-16","regdate":"2021-12-31","value1":"280817775.955","value2":"42613.8070684931","expect":"2042-07-04"},
{"topdown":"하선","leftRight":"좌&우","start":"1583.936","end":"3113.341","after":"1529.405","change":"1999-10-6","regdate":"2021-12-31","value1":"414246813.04","value2":"42660.164328767","expect":"2033-12-02"},
{"topdown":"하선","leftRight":"좌&우","start":"3113.341","end":"4183.799","after":"1070.458","change":"1999-10-6","regdate":"2021-12-31","value1":"414290720.96","value2":"42780.4599999999","expect":"2033-11-18"},
{"topdown":"하선","leftRight":"좌&우","start":"4183.799","end":"5289.13","after":"1105.331","change":"1999-10-6","regdate":"2021-12-31","value1":"414340728.54","value2":"42917.4670684931","expect":"2033-11-03"},
{"topdown":"하선","leftRight":"좌&우","start":"5289.13","end":"6187.321","after":"898.191","change":"1999-10-6","regdate":"2021-12-31","value1":"414450122.16","value2":"43217.1756164383","expect":"2033-10-02"},
{"topdown":"하선","leftRight":"좌&우","start":"6187.321","end":"7097.322","after":"910.001","change":"1999-10-6","regdate":"2021-12-31","value1":"414527925.76","value2":"43430.3361643835","expect":"2033-09-09"},
{"topdown":"하선","leftRight":"좌&우","start":"7097.322","end":"8536.808","after":"1439.486","change":"1999-10-6","regdate":"2021-12-31","value1":"414717173.77","value2":"43948.8238630136","expect":"2033-07-16"},
{"topdown":"하선","leftRight":"좌&우","start":"8536.808","end":"9506.809","after":"970.000999999998","change":"1999-10-6","regdate":"2021-12-31","value1":"414823774.32","value2":"44240.8801643835","expect":"2033-06-16"},
{"topdown":"하선","leftRight":"좌&우","start":"9506.809","end":"10641.535","after":"1134.726","change":"1999-10-6","regdate":"2021-12-31","value1":"414753697.81","value2":"44048.8897260273","expect":"2033-07-06"},
{"topdown":"하선","leftRight":"좌&우","start":"10641.535","end":"11531.533","after":"889.998","change":"1999-10-6","regdate":"2021-12-31","value1":"414829929.98","value2":"44257.7449863013","expect":"2033-06-14"},
{"topdown":"하선","leftRight":"좌&우","start":"11531.533","end":"12386.915","after":"855.382000000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414968035.57","value2":"44636.1164657533","expect":"2033-05-07"},
{"topdown":"하선","leftRight":"좌&우","start":"12386.915","end":"13512.966","after":"1126.051","change":"1999-10-6","regdate":"2021-12-31","value1":"414960370.92","value2":"44615.1174246574","expect":"2033-05-09"},
{"topdown":"하선","leftRight":"좌&우","start":"13512.966","end":"14563","after":"1050.034","change":"1999-10-6","regdate":"2021-12-31","value1":"414963050.24","value2":"44622.4580273972","expect":"2033-05-08"},
{"topdown":"하선","leftRight":"좌&우","start":"14563","end":"15143","after":"580","change":"2020-12-16","regdate":"2021-12-31","value1":"17207457.9651232","value2":"44660.58769863","expect":"2057-09-22"},
{"topdown":"하선","leftRight":"좌&우","start":"15143","end":"16086.378","after":"943.378000000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414976967.57","value2":"44660.58769863","expect":"2033-05-04"},
{"topdown":"하선","leftRight":"좌&우","start":"16086.378","end":"17071.4805","after":"985.102500000001","change":"1999-10-6","regdate":"2021-12-31","value1":"415107579.94","value2":"45018.4298082191","expect":"2033-03-30"},
{"topdown":"하선","leftRight":"좌&우","start":"17071.4805","end":"17881.3875","after":"809.906999999999","change":"1999-10-6","regdate":"2021-12-31","value1":"415019991.04","value2":"44778.460219178","expect":"2033-04-23"},
{"topdown":"하선","leftRight":"좌&우","start":"17881.3875","end":"18691.475","after":"810.087499999998","change":"1999-10-6","regdate":"2021-12-31","value1":"414920161.24","value2":"44504.9539178081","expect":"2033-05-20"},
{"topdown":"하선","leftRight":"좌&우","start":"18691.475","end":"19530.145","after":"838.670000000002","change":"1999-10-6","regdate":"2021-12-31","value1":"414912487.84","value2":"44483.9309041094","expect":"2033-05-22"},
{"topdown":"하선","leftRight":"좌&우","start":"19530.145","end":"20668.023","after":"1137.878","change":"1999-10-6","regdate":"2021-12-31","value1":"414868317","value2":"44362.9149041095","expect":"2033-06-04"},
{"topdown":"하선","leftRight":"좌&우","start":"20668.023","end":"21538.0645","after":"870.041499999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414822315.45","value2":"44236.8832602739","expect":"2033-06-17"},
{"topdown":"하선","leftRight":"좌&우","start":"21538.0645","end":"22588.2375","after":"1050.173","change":"1999-10-6","regdate":"2021-12-31","value1":"414763261.84","value2":"44075.0925479451","expect":"2033-07-03"},
{"topdown":"하선","leftRight":"좌&우","start":"22588.2375","end":"23588.0855","after":"999.848000000002","change":"1999-10-6","regdate":"2021-12-31","value1":"414608098.86","value2":"43649.9884931506","expect":"2033-08-17"},
{"topdown":"하선","leftRight":"좌&우","start":"23588.0855","end":"24197.685","after":"609.5995","change":"1999-10-6","regdate":"2021-12-31","value1":"414535662.86","value2":"43451.53369863","expect":"2033-09-07"},
{"topdown":"하선","leftRight":"좌&우","start":"24197.685","end":"25127.633","after":"929.948","change":"2009-6-1","regdate":"2021-12-31","value1":"243916132.965","value2":"43451.53369863","expect":"2044-06-07"},
{"topdown":"하선","leftRight":"좌&우","start":"25127.633","end":"25947.759","after":"820.125999999997","change":"2009-6-1","regdate":"2021-12-31","value1":"243837230.645","value2":"43235.362958904","expect":"2044-07-20"},
{"topdown":"하선","leftRight":"좌&우","start":"25947.759","end":"27360.108","after":"1412.349","change":"2009-6-1","regdate":"2021-12-31","value1":"243682983.335","value2":"42812.767589041","expect":"2044-10-13"},
{"topdown":"하선","leftRight":"좌&우","start":"27360.108","end":"28350.329","after":"990.221000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243611290.805","value2":"42616.34969863","expect":"2044-11-22"},
{"topdown":"하선","leftRight":"좌&우","start":"28350.329","end":"29240.026","after":"889.697","change":"2009-6-1","regdate":"2021-12-31","value1":"243515473.195","value2":"42353.83569863","expect":"2045-01-15"},
{"topdown":"하선","leftRight":"좌&우","start":"29240.026","end":"30059.961","after":"819.934999999998","change":"2009-6-1","regdate":"2021-12-31","value1":"243450409.735","value2":"42175.5796438355","expect":"2045-02-21"},
{"topdown":"하선","leftRight":"좌&우","start":"30059.961","end":"30723.948","after":"663.987000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243430238.885","value2":"42120.3170410958","expect":"2045-03-05"},
{"topdown":"하선","leftRight":"좌&우","start":"30723.948","end":"31017","after":"293.052","change":"20-12-12","regdate":"2021-12-31","value1":"16052538.61","value2":"42120.3170410958","expect":"2059-12-15"},
{"topdown":"하선","leftRight":"좌&우","start":"31017","end":"31554.287","after":"537.287","change":"20-12-12","regdate":"2021-12-31","value1":"15975613.9999999","value2":"41915.0739726026","expect":"2060-02-23"},

];


function CumulativeThroughput( props ) {
  console.log(tableData);
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  const addKToNumber = (num, sign) => {
    let strNum = Number(num).toFixed(0);
    let reversedStrNum = strNum.split('').reverse().join('');
    let newStrNum = '';
  
    for (let i = 0; i < reversedStrNum.length; i++) {
      if (i > 0 && i % 3 === 0) {
        newStrNum += sign;
      }
      newStrNum += reversedStrNum[i];
    }
  
    return newStrNum.split('').reverse().join('');
  }

  return (
    <div className="cumulativeThroughput" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox" style={{height:"100px"}} >
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
            <div className="optionValue">414,953,971</div>
          </div>
          <div className="curDate optionBox borderColorGreen" >
            <div className="optionTitle">우레일</div>
            <div className="optionValue">414,953,971</div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height: "calc( 100% - 350px)" }} >
        <div className="containerTitle">검토 누적통과톤수</div>
        <div className="componentBox flex section" style={{flexDirection: "column"}} >
          <div className="searchOption">
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
              <div className="optionValue">600,000,000</div>
            </div>
          </div>
          <div className="tableBox" style={{ marginTop: "10px", width: "100%", height: "calc( 100% - 95px)"}}>
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td">상하</div>
                  <div className="td">좌우</div>
                  <div className="td">시점위치</div>
                  <div className="td">종점위치</div>
                  <div className="td">연장</div>
                  <div className="td">교체일</div>
                  <div className="td">계측일자</div>
                  <div className="td">누적통과톤수</div>
                  <div className="td">일 평균 통과톤수</div>
                  <div className="td">갱환예상일자</div>
                </div>
              </div>
              <div className="tableBody">
                {
                  tableData.map( (tr) => {
                    return <div className="tr">
                    <div className="td">{tr.topdown}</div>
                    <div className="td">{tr.leftRight}</div>
                    <div className="td">{addKToNumber(tr.start, 'K')}</div>
                    <div className="td">{addKToNumber(tr.end, 'K')}</div>
                    <div className="td">{addKToNumber(tr.after, ",")}</div>
                    <div className="td">{tr.change}</div>
                    <div className="td">{tr.regdate}</div>
                    <div className="td">{addKToNumber(tr.value1,",")}</div>
                    <div className="td">{addKToNumber(tr.value2,",")}</div>
                    <div className="td">{tr.expect}</div>
                  </div>
                  })
                }
                {/* <div className="tr">
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
                </div> */}
              </div>
            </div>
          </div>
          {/* <div className="curDate optionBox borderColorGreen">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CumulativeThroughput;
