import Main from  '../Components/Main';
import Webcall from  '../Components/Webcall';
import {Route,Switch} from 'react-router-dom';

function Chatwindow(){
    return(
        <Switch>
            <Route exact path={'/chat'} component={Main}></Route>
            <Route path = {'/chat/vc'} component = {Webcall}></Route>

        </Switch>

      
    );
}

export default Chatwindow;