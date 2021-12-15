import '../CSS/Start.css';
import titlelogo from '../Logo/video-call (1).png';
import bg from '../Logo/sbg.png';
// import startlogo from '../Logo/Young.jpg';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


function Start() {

    return (
        <>
            <div className="start">
                <Link to='/'>
                    <img src={titlelogo} alt=""/>
                </Link>
                <div className="name">Microsoft Teams</div>
            </div>
            <div className="home">
                <div className="components">

                    <Container component="main" maxWidth="xs">
                        <div className="getstarted">
                            <div className="new">
                                <span className="btntxt">New User?</span>
                                <Link 
                                    to="/signup"
                                    style={{textDecoration:"none"}}
                                >
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary">Sign Up</Button>
                                </Link>
                            </div>
                            <div className="sg">
                                <span className="btntxt">Already have an account?</span>
                                <Link 
                                    to="signin"
                                    style={{textDecoration:"none"}}
                                    >
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary">Sign In</Button>
                                </Link>
                            </div>
                        </div>
                    </Container>

                </div>


                <div className="homeimage">
                    <img src={bg} alt="" />
                </div>

            </div>
        </>
    );
}

export default Start;