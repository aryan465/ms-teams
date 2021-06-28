import '../CSS/getstarted.css';
import {Link} from 'react-router-dom';

const GetStarted = ()=>{
    return(
    <div className="getstarted">
        <div className="new">
            New To Teams
            <Link to="/signup"><button>Sign Up</button></Link> 
        </div>
        <div className="sg">
            Already have an account.
            <Link to="signin"><button>Sign In</button></Link>
        </div>
        <a href ="../Components/Main.jsx"><button>Chat</button></a>
    </div>

    );
}

export default GetStarted;