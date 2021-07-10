import '../CSS/Start.css';
import titlelogo from '../Logo/video-call (1).png';
import vc from '../Logo/vcl.jpg';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


function Start() {

    return (
        <>
            <div className="start">
                <img src={titlelogo} alt="" />
                <div className="name">Microsoft Teams</div>

            </div>
            <div className="home">
                <div className="components">

                    <Container component="main" maxWidth="xs">
                        <div className="getstarted">
                            <div className="new">
                                <span className="btntxt">New To Teams..?</span>
                                <Link to="/signup">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary">Sign Up</Button>
                                </Link>
                            </div>
                            <div className="sg">
                                <span className="btntxt">Already have an account...</span>
                                <Link to="signin">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary">Sign In</Button>
                                </Link>
                            </div>
                        </div>
                    </Container>

                </div>


                <div className="homeimage">
                    <img src={vc} alt="" />
                </div>

            </div>
        </>
    );
}

export default Start;