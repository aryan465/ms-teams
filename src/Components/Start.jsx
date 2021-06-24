import '../CSS/Start.css';
import titlelogo from '../Logo/video-call (1).png';
import vc from '../Logo/vcc.jpg';
import SignUp from '../Components/SignUp';
import SignIn from '../Components/SignIn';
import { Route,Switch } from 'react-router-dom';


function Start() {
    return (
        <>
            <header>
                <img src={titlelogo} alt="" />
                <div className="name">Microsoft Teams</div>

            </header>

            <div className="home">
                <div className="components">
                <Switch>
                    <Route path="/signup" component = {SignUp} />
                    <Route path="/signin" component = {SignIn} />
                </Switch>
                </div>
                <div className="homeimage">
                    <img src={vc} alt="" />
                </div>
            </div>
        </>
    );
}

export default Start;