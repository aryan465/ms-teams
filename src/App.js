import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
import Start from './Components/Start';
import { useState, useEffect } from 'react';
import {auth} from './config/fbConfig';
import { Redirect } from 'react-router';



function App() {

  const[val,setVal] = useState(0);
  
  // useEffect((val)=>{
  //   if (auth.currentUser!==null){
  //     console.log(auth);
  //     setVal(0);
  //     console.log(val);
  //     <Redirect to = '/'/>
  //   }
  //   console.log(13)

  // },[val])

  if (val ===0){
  return (
    <div className="App">
    <Chatwindow/>

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
