import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
// import Webcall from './Components/Webcall';
import Start from './Components/Start';
import { Route, Switch } from 'react-router';

function App() {
  let val = 0;
  if (val ===0){
  return (
    <div className="App">
    <Chatwindow/>
    {/* <Webcall/> */}
    </div>
  );}

  else{
    return(
      <div className="App">
      <Start/>
      </div>
      
    );
  }
}

export default App;
