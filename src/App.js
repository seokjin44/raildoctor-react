import './App.css';
import Main from './layout/main/main';
import Main2 from './layout/main2/main2';
import { Member } from './models/member';
import { RecoilRoot } from 'recoil';

const memberList = [
  new Member("admin", "admin"),
  new Member("user", "user"),
]

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Main2
          memberList={memberList}
        />

      </RecoilRoot>
    </div>
  );
}

export default App;
