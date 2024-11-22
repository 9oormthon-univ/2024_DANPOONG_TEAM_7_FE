import { useNavigate } from 'react-router-dom';
import BackBtn from '../../assets/images/layout/back-button.svg'

export default function Back() {
    const navigate = useNavigate();
    
    function goBack() {
        navigate(-1);
    }

    return (
        
            <img onClick={goBack} src={BackBtn} style={{position:"absolute", zIndex:"1000", top:"9px",left: "20px", width:"11px", margin:"75px 0 0 0px"}}/>
        
    );
}
