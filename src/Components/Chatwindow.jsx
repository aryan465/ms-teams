import Main from  '../Components/Main';
import Test from  '../Components/Test';
import {Route,Switch} from 'react-router-dom';

function Chatwindow(){
    return(
        <Switch>
            <Route exact path={'/'} component={Main}></Route>
            <Route path = {'/vc'} component = {Test}></Route>

        </Switch>
    );
}

export default Chatwindow;