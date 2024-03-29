import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
import Start from './Components/Start';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import { Route, Switch } from 'react-router-dom';



function App() {


  return(
    <div id = "App" className="App">
      <Switch>
        <Route exact path = '/' component={Start}></Route>
        <Route path = '/signin' component={SignIn}></Route>
        <Route path = '/signup' component={SignUp}></Route>
        <Route path = '/chat' component={Chatwindow}></Route>
      </Switch>
    </div>
  );
}

export default App;
