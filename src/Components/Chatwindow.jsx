import Main from  '../Components/Main';
import Test from  '../Components/Test';
import Webcall from  '../Components/Webcall';
import {Route,Switch} from 'react-router-dom';

function Chatwindow(){
    return(
        <Switch>
            <Route exact path={'/'} component={Main}></Route>
            <Route path = {'/vc'} component = {Webcall}></Route>

        </Switch>
    );
}

export default Chatwindow;