import './CSS/App.css';
import Main from './Components/Main';
import Start from './Components/Start';
import { Route, Switch } from 'react-router';

function App() {
  return (
    <div className="App">

    {/* <Switch>
    <Route path = "/" component={Start}></Route>
    <Route path = "/chatwindow" component={Main}></Route>
    </Switch>  */}
    {/* <Start/> */}
    <Main/>


    </div>
  );
}

export default App;
