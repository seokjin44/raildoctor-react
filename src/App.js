import './App.css';
import Main from './layout/main/main';
import Main2 from './layout/main2/main2';
import { Member } from './models/member';

const memberList = [
  new Member("admin", "admin"),
  new Member("user", "user"),
]

function App() {
  return (
    <div className="App">
      <Main2
        memberList={memberList}
      />
    </div>
  );
}

export default App;
