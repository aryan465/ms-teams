import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
import Start from './Components/Start';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import { useState, useEffect } from 'react';
import { auth } from './config/fbConfig';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';



function App() {


  // const [val, setVal] = useState(0);
  // if (val === 1) {
  //   return (
  //     <div className="App">
  //       <Chatwindow />

  //     </div>
  //   );
  // }

  // else {
  //   return (

  //     <div className="App">
  //       <Start />
  //     </div>

  //   );
  // }

  return(
    <div className="App">
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
