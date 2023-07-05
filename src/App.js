import './App.css';
import Main from './layout/main/main';
import { Member } from './models/member';

const memberList = [
  new Member("admin", "admin"),
  new Member("user", "user"),
]

function App() {
  return (
    <div className="App">
      <Main
        memberList={memberList}
      />
    </div>
  );
}

export default App;
