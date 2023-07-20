import "./railTrackAlignment.css";
import { useEffect, useRef, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import Position from "../../assets/zodo2.png";
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import IncheonTrackImg from "../../assets/incheon_track2.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";

import Box from '@mui/material/Box';
import ChartAuto from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Modal } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import { RANGEPICKERSTYLE } from "../../constant";
import { DatePicker, Input } from "antd";
/* import {
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
 */

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: "5px",
  //p: 4,
  padding : "5px",
  fontFamily : 'NEO_R'
};

const data1 = [{"km":14.60021535,"mm":0.351811841}, 
{"km":14.60022023,"mm":0.357228507}, 
{"km":14.6002251,"mm":0.371861841}, 
{"km":14.60022998,"mm":0.371322952}, 
{"km":14.60023486,"mm":0.369161841}, 
{"km":14.60023973,"mm":0.36915073}, 
{"km":14.60024461,"mm":0.37240073}, 
{"km":14.60024949,"mm":0.373761841}, 
{"km":14.60025436,"mm":0.367506285}, 
{"km":14.60025924,"mm":0.370767396}, 
{"km":14.60026412,"mm":0.36480073}, 
{"km":14.60026899,"mm":0.358828507}, 
{"km":14.60027387,"mm":0.354789619}, 
{"km":14.60027875,"mm":0.353417396}, 
{"km":14.60028362,"mm":0.349089619}, 
{"km":14.6002885,"mm":0.344206285}, 
{"km":14.60029338,"mm":0.34040073}, 
{"km":14.60029825,"mm":0.35695073}, 
{"km":14.60030313,"mm":0.358045174}, 
{"km":14.60030801,"mm":0.358861841}, 
{"km":14.60031288,"mm":0.365628507}, 
{"km":14.60031776,"mm":0.371328507}, 
{"km":14.60032264,"mm":0.376745174}, 
{"km":14.60032751,"mm":0.378378507}, 
{"km":14.60033239,"mm":0.382728507}, 
{"km":14.60033727,"mm":0.378117396}, 
{"km":14.60034214,"mm":0.372956285}, 
{"km":14.60034702,"mm":0.368639619}, 
{"km":14.6003519,"mm":0.367822952}, 
{"km":14.60035677,"mm":0.362384063}, 
{"km":14.60036165,"mm":0.358028507}, 
{"km":14.60036653,"mm":0.352878507}, 
{"km":14.6003714,"mm":0.347184063}, 
{"km":14.60037628,"mm":0.339861841}, 
{"km":14.60038116,"mm":0.335239619}, 
{"km":14.60038603,"mm":0.335795174}, 
{"km":14.60039091,"mm":0.321945174}, 
{"km":14.60039579,"mm":0.317889619}, 
{"km":14.60040066,"mm":0.321411841}, 
{"km":14.60040554,"mm":0.328734063}, 
{"km":14.60041042,"mm":0.32385073}, 
{"km":14.60041529,"mm":0.320345174}, 
{"km":14.60042017,"mm":0.330111841}, 
{"km":14.60042505,"mm":0.331195174}, 
{"km":14.60042992,"mm":0.331728507}, 
{"km":14.6004348,"mm":0.329022952}, 
{"km":14.60043968,"mm":0.325767396}, 
{"km":14.60044455,"mm":0.320878507}, 
{"km":14.60044943,"mm":0.310817396}, 
{"km":14.60045431,"mm":0.310311841}, 
{"km":14.60045918,"mm":0.30705073}, 
{"km":14.60046406,"mm":0.303256285}, 
{"km":14.60046894,"mm":0.295911841}, 
{"km":14.60047381,"mm":0.291572952}, 
{"km":14.60047869,"mm":0.290211841}, 
{"km":14.60048357,"mm":0.287228507}, 
{"km":14.60048845,"mm":0.280456285}, 
{"km":14.60049332,"mm":0.279361841}, 
{"km":14.6004982,"mm":0.274217396}, 
{"km":14.60050308,"mm":0.276106285}, 
{"km":14.60050795,"mm":0.283167396}, 
{"km":14.60051283,"mm":0.288067396}, 
{"km":14.60051771,"mm":0.281539619}, 
{"km":14.60052258,"mm":0.282628507}, 
{"km":14.60052746,"mm":0.279906285}, 
{"km":14.60053234,"mm":0.275295174}, 
{"km":14.60053721,"mm":0.270422952}, 
{"km":14.60054209,"mm":0.265545174}, 
{"km":14.60054697,"mm":0.260106285}, 
{"km":14.60055184,"mm":0.256317396}, 
{"km":14.60055672,"mm":0.25305073}, 
{"km":14.6005616,"mm":0.251978507}, 
{"km":14.60056647,"mm":0.24630073}, 
{"km":14.60057135,"mm":0.245745174}, 
{"km":14.60057623,"mm":0.243839619}, 
{"km":14.6005811,"mm":0.249545174}, 
{"km":14.60058598,"mm":0.26255073}, 
{"km":14.60059086,"mm":0.270689619}, 
{"km":14.60059573,"mm":0.273945174}, 
{"km":14.60060061,"mm":0.281567396}, 
{"km":14.60060549,"mm":0.289956285}, 
{"km":14.60061036,"mm":0.29510073}, 
{"km":14.60061524,"mm":0.304328507}, 
{"km":14.60062012,"mm":0.304334063}, 
{"km":14.60062499,"mm":0.306506285}, 
{"km":14.60062987,"mm":0.311939619}, 
{"km":14.60063475,"mm":0.31410073}, 
{"km":14.60063962,"mm":0.310322952}, 
{"km":14.6006445,"mm":0.313289619}, 
{"km":14.60064938,"mm":0.309489619}, 
{"km":14.60065425,"mm":0.309234063}, 
{"km":14.60065913,"mm":0.303795174}, 
{"km":14.60066401,"mm":0.313834063}, 
{"km":14.60066888,"mm":0.314095174}, 
{"km":14.60067376,"mm":0.319795174}, 
{"km":14.60067864,"mm":0.328472952}, 
{"km":14.60068351,"mm":0.337689619}, 
{"km":14.60068839,"mm":0.34610073}, 
{"km":14.60069327,"mm":0.356928507}, 
{"km":14.60069814,"mm":0.358567396}, 
{"km":14.60070309,"mm":0.366995174}, 
{"km":14.6007081,"mm":0.36780073}, 
{"km":14.60071311,"mm":0.372678507}, 
{"km":14.60071812,"mm":0.380022952}, 
{"km":14.60072313,"mm":0.380017396}, 
{"km":14.60072814,"mm":0.37485073}, 
{"km":14.60073315,"mm":0.372684063}, 
{"km":14.60073816,"mm":0.363739619}, 
{"km":14.60074317,"mm":0.358311841}, 
{"km":14.60074818,"mm":0.352889619}, 
{"km":14.60075319,"mm":0.35640073}, 
{"km":14.6007582,"mm":0.351267396}, 
{"km":14.60076321,"mm":0.356684063}, 
{"km":14.60076822,"mm":0.351522952}, 
{"km":14.60077323,"mm":0.359945174}, 
{"km":14.60077824,"mm":0.360739619}, 
{"km":14.60078325,"mm":0.359939619}, 
{"km":14.60078826,"mm":0.365356285}, 
{"km":14.60079327,"mm":0.359656285}, 
{"km":14.60079828,"mm":0.360467396}, 
{"km":14.60080329,"mm":0.366711841}, 
{"km":14.6008083,"mm":0.367256285}, 
{"km":14.60081331,"mm":0.371589619}, 
{"km":14.60081832,"mm":0.363711841}, 
{"km":14.60082333,"mm":0.360445174}, 
{"km":14.60082834,"mm":0.35640073}, 
{"km":14.60083335,"mm":0.353967396}, 
{"km":14.60083836,"mm":0.344195174}, 
{"km":14.60084337,"mm":0.33445073}, 
{"km":14.60084838,"mm":0.329556285}, 
{"km":14.60085339,"mm":0.32930073}, 
{"km":14.6008584,"mm":0.330389619}, 
{"km":14.60086341,"mm":0.330645174}, 
{"km":14.60086842,"mm":0.339595174}, 
{"km":14.60087343,"mm":0.339589619}, 
{"km":14.60087844,"mm":0.344184063}, 
{"km":14.60088345,"mm":0.346367396}, 
{"km":14.60088846,"mm":0.344467396}, 
{"km":14.60089347,"mm":0.346622952}, 
{"km":14.60089848,"mm":0.348784063}, 
{"km":14.60090349,"mm":0.345822952}, 
{"km":14.6009085,"mm":0.342567396}, 
{"km":14.60091351,"mm":0.342556285}, 
{"km":14.60091852,"mm":0.342584063}, 
{"km":14.60092353,"mm":0.33960073}, 
{"km":14.60092854,"mm":0.329278507}, 
{"km":14.60093355,"mm":0.325217396}, 
{"km":14.60093856,"mm":0.320334063}, 
{"km":14.60094357,"mm":0.308656285}, 
{"km":14.60094858,"mm":0.302956285}, 
{"km":14.60095359,"mm":0.294561841}, 
{"km":14.6009586,"mm":0.282622952}, 
{"km":14.60096362,"mm":0.280178507}, 
{"km":14.60096863,"mm":0.277184063}, 
{"km":14.60097364,"mm":0.275284063}, 
{"km":14.60097865,"mm":0.275839619}, 
{"km":14.60098366,"mm":0.266361841}, 
{"km":14.60098867,"mm":0.263911841}, 
{"km":14.60099368,"mm":0.25550073}, 
{"km":14.60099869,"mm":0.247367396}, 
{"km":14.6010037,"mm":0.24980073}, 
{"km":14.60100871,"mm":0.244639619}, 
{"km":14.60101372,"mm":0.235172952}, 
{"km":14.60101873,"mm":0.23380073}, 
{"km":14.60102374,"mm":0.22485073}, 
{"km":14.60102875,"mm":0.223761841}, 
{"km":14.60103376,"mm":0.21535073}, 
{"km":14.60103877,"mm":0.201806285}, 
{"km":14.60104378,"mm":0.195028507}, 
{"km":14.60104879,"mm":0.191506285}, 
{"km":14.6010538,"mm":0.17440073}, 
{"km":14.60105881,"mm":0.170872952}, 
{"km":14.60106382,"mm":0.16545073}, 
{"km":14.60106883,"mm":0.159478507}, 
{"km":14.60107384,"mm":0.153245174}, 
{"km":14.60107885,"mm":0.148356285}, 
{"km":14.60108386,"mm":0.144017396}, 
{"km":14.60108887,"mm":0.138034063}, 
{"km":14.60109388,"mm":0.127461841}, 
{"km":14.60109889,"mm":0.115795174}, 
{"km":14.6011039,"mm":0.106017396}, 
{"km":14.60110891,"mm":0.095461841}, 
{"km":14.60111392,"mm":0.090295174}, 
{"km":14.60111893,"mm":0.079995174}, 
{"km":14.60112394,"mm":0.07130073}, 
{"km":14.60112895,"mm":0.06695073}, 
{"km":14.60113396,"mm":0.066128507}, 
{"km":14.60113897,"mm":0.071567396}, 
{"km":14.60114398,"mm":0.074295174}, 
{"km":14.60114899,"mm":0.076461841}, 
{"km":14.601154,"mm":0.083784063}, 
{"km":14.60115901,"mm":0.09005073}, 
{"km":14.60116402,"mm":0.099267396}, 
{"km":14.60116903,"mm":0.116895174}, 
{"km":14.60117404,"mm":0.126639619}, 
{"km":14.60117905,"mm":0.133984063}, 
{"km":14.60118406,"mm":0.141039619}, 
{"km":14.60118907,"mm":0.147006285}, 
{"km":14.60119408,"mm":0.151339619}, 
{"km":14.60119909,"mm":0.154589619}, 
{"km":14.60120411,"mm":0.154856285}, 
{"km":14.60120913,"mm":0.160272952}, 
{"km":14.60121415,"mm":0.161345174}, 
{"km":14.60121917,"mm":0.169234063}, 
{"km":14.60122419,"mm":0.17330073}, 
{"km":14.60122921,"mm":0.176295174}, 
{"km":14.60123423,"mm":0.182256285}, 
{"km":14.60123926,"mm":0.186872952}, 
{"km":14.60124428,"mm":0.189839619}, 
{"km":14.6012493,"mm":0.200967396}, 
{"km":14.60125432,"mm":0.203678507}, 
{"km":14.60125934,"mm":0.212106285}, 
{"km":14.60126436,"mm":0.219684063}, 
{"km":14.60126938,"mm":0.22430073}, 
{"km":14.6012744,"mm":0.231089619}, 
{"km":14.60127942,"mm":0.242761841}, 
{"km":14.60128444,"mm":0.249534063}, 
{"km":14.60128946,"mm":0.257661841}, 
{"km":14.60129448,"mm":0.26390073}, 
{"km":14.60129951,"mm":0.26365073}, 
{"km":14.60130453,"mm":0.267161841}, 
{"km":14.60130955,"mm":0.265272952}, 
{"km":14.60131457,"mm":0.267178507}, 
{"km":14.60131959,"mm":0.26825073}, 
{"km":14.60132461,"mm":0.266095174}, 
{"km":14.60132963,"mm":0.265267396}, 
{"km":14.60133465,"mm":0.269595174}, 
{"km":14.60133967,"mm":0.274767396}, 
{"km":14.60134469,"mm":0.27885073}, 
{"km":14.60134971,"mm":0.286172952}, 
{"km":14.60135474,"mm":0.291584063}, 
{"km":14.60135976,"mm":0.299161841}, 
{"km":14.60136478,"mm":0.302961841}, 
{"km":14.6013698,"mm":0.307028507}, 
{"km":14.60137482,"mm":0.315184063}, 
{"km":14.60137984,"mm":0.319517396}, 
{"km":14.60138486,"mm":0.324139619}, 
{"km":14.60138988,"mm":0.330361841}, 
{"km":14.6013949,"mm":0.327134063}, 
{"km":14.60139992,"mm":0.33335073}, 
{"km":14.60140494,"mm":0.32765073}, 
{"km":14.60140997,"mm":0.332539619}, 
{"km":14.60141499,"mm":0.329834063}, 
{"km":14.60142001,"mm":0.330911841}, 
{"km":14.60142503,"mm":0.333061841}, 
{"km":14.60143005,"mm":0.328195174}, 
{"km":14.60143507,"mm":0.332267396}, 
{"km":14.60144009,"mm":0.332834063}, 
{"km":14.60144511,"mm":0.335511841}, 
{"km":14.60145013,"mm":0.342556285}, 
{"km":14.60145515,"mm":0.345572952}, 
{"km":14.60146017,"mm":0.351267396}, 
{"km":14.6014652,"mm":0.357228507}, 
{"km":14.60147022,"mm":0.364817396}, 
{"km":14.60147524,"mm":0.363989619}, 
{"km":14.60148026,"mm":0.367261841}, 
{"km":14.60148528,"mm":0.368328507}, 
{"km":14.6014903,"mm":0.363456285}, 
{"km":14.60149532,"mm":0.366445174}, 
{"km":14.60150034,"mm":0.359939619}, 
{"km":14.60150536,"mm":0.359922952}, 
{"km":14.60151038,"mm":0.353978507}, 
{"km":14.6015154,"mm":0.347461841}, 
{"km":14.60152043,"mm":0.353695174}, 
{"km":14.60152545,"mm":0.350989619}, 
{"km":14.60153047,"mm":0.355045174}, 
{"km":14.60153549,"mm":0.351256285}, 
{"km":14.60154051,"mm":0.351256285}, 
{"km":14.60154553,"mm":0.350989619}, 
{"km":14.60155055,"mm":0.353989619}, 
{"km":14.60155557,"mm":0.351528507}, 
{"km":14.60156059,"mm":0.344217396}, 
{"km":14.60156561,"mm":0.345006285}, 
{"km":14.60157063,"mm":0.344189619}, 
{"km":14.60157566,"mm":0.343645174}, 
{"km":14.60158068,"mm":0.343111841}, 
{"km":14.6015857,"mm":0.337972952}, 
{"km":14.60159072,"mm":0.339322952}, 
{"km":14.60159574,"mm":0.337689619}, 
{"km":14.60160076,"mm":0.33145073}, 
{"km":14.60160578,"mm":0.333095174}, 
{"km":14.6016108,"mm":0.32305073}, 
{"km":14.60161582,"mm":0.324678507}, 
{"km":14.60162084,"mm":0.317911841}, 
{"km":14.60162586,"mm":0.323856285}, 
{"km":14.60163088,"mm":0.32685073}, 
{"km":14.60163591,"mm":0.326584063}, 
{"km":14.60164093,"mm":0.328756285}, 
{"km":14.60164595,"mm":0.321984063}, 
{"km":14.60165097,"mm":0.327645174}, 
{"km":14.60165599,"mm":0.32765073}, 
{"km":14.60166101,"mm":0.326561841}, 
{"km":14.60166603,"mm":0.323856285}, 
{"km":14.60167105,"mm":0.317072952}, 
{"km":14.60167607,"mm":0.314906285}, 
{"km":14.60168109,"mm":0.312484063}, 
{"km":14.60168611,"mm":0.308406285}, 
{"km":14.60169114,"mm":0.299167396}, 
{"km":14.60169616,"mm":0.294817396}, 
{"km":14.60170118,"mm":0.283439619}, 
{"km":14.6017062,"mm":0.277761841}, 
{"km":14.60171121,"mm":0.273422952}, 
{"km":14.60171622,"mm":0.270406285}, 
{"km":14.60172124,"mm":0.269867396}, 
{"km":14.60172625,"mm":0.272317396}, 
{"km":14.60173127,"mm":0.273934063}, 
{"km":14.60173628,"mm":0.281539619}, 
{"km":14.60174129,"mm":0.285889619}, 
{"km":14.60174631,"mm":0.285072952}, 
{"km":14.60175132,"mm":0.28915073}, 
{"km":14.60175634,"mm":0.292934063}, 
{"km":14.60176135,"mm":0.294028507}, 
{"km":14.60176636,"mm":0.294028507}, 
{"km":14.60177138,"mm":0.295389619}, 
{"km":14.60177639,"mm":0.291034063}, 
{"km":14.60178141,"mm":0.292939619}, 
{"km":14.60178642,"mm":0.291306285}, 
{"km":14.60179143,"mm":0.28480073}, 
{"km":14.60179645,"mm":0.281272952}, 
{"km":14.60180146,"mm":0.274206285}, 
{"km":14.60180648,"mm":0.271534063}, 
{"km":14.60181149,"mm":0.266906285}, 
{"km":14.6018165,"mm":0.267178507}, 
{"km":14.60182152,"mm":0.267972952}, 
{"km":14.60182653,"mm":0.263639619}, 
{"km":14.60183155,"mm":0.262545174}, 
{"km":14.60183656,"mm":0.264717396}, 
{"km":14.60184157,"mm":0.264206285}, 
{"km":14.60184659,"mm":0.263917396}, 
{"km":14.6018516,"mm":0.264184063}, 
{"km":14.60185662,"mm":0.260645174}, 
{"km":14.60186163,"mm":0.263089619}, 
{"km":14.60186664,"mm":0.26175073}, 
{"km":14.60187166,"mm":0.265272952}, 
{"km":14.60187667,"mm":0.26310073}, 
{"km":14.60188169,"mm":0.264717396}, 
{"km":14.6018867,"mm":0.263639619}, 
{"km":14.60189172,"mm":0.262828507}, 
{"km":14.60189673,"mm":0.258472952}, 
{"km":14.60190174,"mm":0.253867396}, 
{"km":14.60190676,"mm":0.253872952}, 
{"km":14.60191177,"mm":0.254945174}, 
{"km":14.60191679,"mm":0.259561841}, 
{"km":14.6019218,"mm":0.261745174}, 
{"km":14.60192681,"mm":0.269628507}, 
{"km":14.60193183,"mm":0.271806285}, 
{"km":14.60193684,"mm":0.270989619}, 
{"km":14.60194186,"mm":0.270711841}, 
{"km":14.60194687,"mm":0.276656285}, 
{"km":14.60195188,"mm":0.272045174}
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

function RailTrackAlignment( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [trackDetailDragging, setTrackDetailDragging] = useState(false);
  const [trackDetailPosition, setTrackDetailPosition] = useState({x: 0, y: 0});
  const [scale, setScale] = useState(1);
  const [lastPos, setLastPos] = useState(null);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }

  const trackDetailCanvasRef = useRef(null);
  const trackDetailHandleMouseDown = (e) => {
    setTrackDetailDragging(true);
    setLastPos({x: e.clientX, y: e.clientY});
  };
  const trackDetailHandleMouseUp = () => {
    setTrackDetailDragging(false);
    setLastPos(null);
  };
  const trackDetailHandleMouseMove = (e) => {
    if (trackDetailDragging) {
      const newPos = {x: e.clientX, y: e.clientY};
      const canvas = trackDetailCanvasRef.current;
      const img = new Image();
      img.src = IncheonTrackImg; // replace with your image url
  
      img.onload = function() {
        const newPosX = trackDetailPosition.x + newPos.x - lastPos.x;
        const newWidth = img.width * scale;
        
        // Check if the new position is outside the canvas
        if (newPosX <= 0 && newPosX + newWidth >= canvas.width) {
          setTrackDetailPosition({
            x: newPosX,
            y: trackDetailPosition.y
          });
        }
        setLastPos(newPos);
      };
    }
  };

  const trackDetailDrawImage = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    //img.src = 'https://example.com/image.jpg'; // replace with your image url
    img.src= IncheonTrackImg;
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
      ctx.scale(scale, 0.285); // Apply scaling 
      ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image
      ctx.restore(); // Restore the context to its saved state
    };
  }

  useEffect(() => {
  }, []);

  useEffect(() => {

    let trackDetailContainer = document.getElementById("trackCanvas");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

  }, []);

  useEffect(() => {
    trackDetailDrawImage();
  }, [trackDetailPosition, scale]);
  
  return (
    <div className="trackDeviation railTrackAlignment" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">측정분기 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                  <Select
                    /* defaultValue="lucy" */
                    style={{...{ width : 120 },...RANGEPICKERSTYLE}}
                    /* onChange={handleChange} */
                    options={[
                      { value: '2022 1분기', label: '2022 1분기' },
                      { value: '2022 2분기', label: '2022 2분기' },
                      { value: '2022 3분기', label: '2022 3분기' },
                      { value: '2022 4분기', label: '2022 4분기' },
                    ]}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              {/* <div className="dataOption">
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
              </div> */}
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={"간석오거리 - 인천시청"}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
              {/* <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div> */}
              {/* <div className="line"></div> */}
            </div>
      </div>
      <div className="contentBox" >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section " style={{ height: "130px"}} >

          <div className="position optionBox borderColorGreen" style={{width: "935px"}} >
            <div className="optionTitle">위치</div>
            <div className="optionValue">
              <img src={Position} />
            </div>
          </div>

          {/* <div className="radioButtons optionBox ">
            <RadioGroup defaultValue="outlined" name="radio-buttons-group" 
              orientation="horizontal" 
              size="sm"  
              variant="outlined" style={{border : 0}}
            >
              <Radio value="outlined" label="상선" />
              <Radio value="soft" label="하선" />
            </RadioGroup>

          </div>

          <div className="radioButtons optionBox ">
            <RadioGroup defaultValue="outlined" name="radio-buttons-group" 
              orientation="horizontal" 
              size="sm"  
              variant="outlined" style={{border : 0}}
            >
              <Radio value="outlined" label="좌레일" />
              <Radio value="soft" label="우레일" />
            </RadioGroup>
          </div> */}

        </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "480px"}}>
        <div className="containerTitle">Chart
          <div className="modalButton highlight orange" onClick={()=>{
              console.log("예측데이터 상세보기");
              setOpen(true);
            }} >유지보수지침</div>
        </div>
        <div className="componentBox chartBox flex">
          <div id="trackCanvas" className="trackBox">
            <div className="curLine"></div>
            <canvas id="trackDetailCanvas"
                  ref={trackDetailCanvasRef}
                  onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                  onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                  onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                  //onWheel={trackDetailHandleWheel}
              />
          </div>
          <div className="chartBox">
            <div className="curLine"></div>
            {/* <Chart type='bar' data={data} /> */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={data1}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="km" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mm" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />유지보수 지침등록 
              <div className="closeBtn" onClick={()=>{setOpen(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="chartConatiner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={data1}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="km" fontSize={12} />
                    <YAxis  fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mm" stroke="#82ca9d" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="comment" style={{ marginTop: "50px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">유지보수 의사결정</div>
                <div className="commentInput">
                  <TextArea rows={6} />
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

export default RailTrackAlignment;
