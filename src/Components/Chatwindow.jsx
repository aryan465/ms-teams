import Main from '../Components/Main';
import Webcall from '../Components/Webcall';
import { Routes, Route } from 'react-router-dom';

function Chatwindow() {
    return (
        <Routes>
            <Route index element={<Main />} />
            <Route path="vc" element={<Webcall />} />
        </Routes>
    );
}

export default Chatwindow;