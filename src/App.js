import './CSS/App.css';
import Main from './Components/Main';
import Start from './Components/Start';
import { Route, Switch } from 'react-router';

function App() {
  let val = 0;
  if (val ===0){
  return (
    <div className="App">


    <Main/>


    </div>
  );}
  else{
    return(
      <Start/>
    );
  }
}

export default App;
