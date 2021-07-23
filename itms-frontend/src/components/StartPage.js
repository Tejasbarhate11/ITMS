import { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";

const StartPage = () => {
    const  history = useHistory();
    const { id } = useParams();

    const url = "/assignments/data/"+id;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    const startTest = () => {
        fetch("/examinee/login/"+id)
        .then(response => {
            if(!response.ok){
                throw Error('Some error occurred while starting the test!');
            }
            return response.json();
        })
        .then(data => {
            setIsChecking(false);
            if(data.success){
                sessionStorage.setItem('auth', true);
                history.replace("/start");
            }else{
                alert(data.message);
            }
        })
        .catch(err => {
            setIsChecking(false);
            setError(err.message);
        })
    }

    const handleVerification = (e) => {
        if(window.confirm("Are you sure you want to start the test?")){
            setIsChecking(true);
            fetch("/assignments/verify/"+id)
            .then(response => {
                if(!response.ok){
                    throw Error('Some error occurred while verifying!');
                }
                return response.json();
            })
            .then(data => {
                if(data.success){
                    startTest();
                }else{
                    setIsChecking(false);
                    alert(data.message);
                }
            })
            .catch(err => {
                setIsChecking(false);
                setError(err.message);
            })  
        }
    }
    
    useEffect(()=>{
        sessionStorage.setItem('auth', false);
        fetch(url)
        .then(response => {
            if(!response.ok) {
                throw Error('Some error occurred!');
            }
            return response.json();
        })
        .then(data => {
            if(data.success){
                setIsLoading(false);
                setError(null);
                setData(data.data);
            }else{
                setIsLoading(false);
                setError(data.message);
            }
        }).catch(err => {
            setIsLoading(false);
            setError(err.message);
        })    
    }, [url]);

    return ( 
        <div className = "container-fluid p-4">
            {isLoading && <div className="alert alert-primary text-center align-middle">
                <div className="spinner-border text-primary"></div>
                <h3 className="mt-2">Loading</h3>
            </div>}
            {error && <div className="alert alert-danger text-center">
                {error}
            </div>}
            {data && <div className="jumbotron mt-1 text-light">
                <h2 className="welcome">Welcome, { data["User"].name} !</h2>
            </div>}
            {data && <div className="mx-auto shadow p-4" style={{marginTop: "10px", marginBottom: "25px", borderRadius: "15px"}}>
                <h5>Test Details</h5>
                <hr/>
                <h6 style={{marginTop: "15px"}}>Title:</h6>
                <p className="details">{ data["Test"].title }</p>

                <h6 style={{marginTop: "15px"}}>Instructions:</h6>
                <div className="details" dangerouslySetInnerHTML={{ __html: data["Test"].instructions}} ></div>

                <h6 style={{marginTop: "15px"}}>Total score:</h6>
                <p className="details">{ data["Test"].total_score }</p>

                <h6 style={{marginTop: "15px"}}>Time limit:</h6>
                <p className="details">{(data["Test"].time_limit/60)} minutes {(data["Test"].time_limit%60)} seconds</p>

                <h6 style={{marginTop: "15px"}}>Department:</h6>
                <p className="details">{ data["Test"]["Department"].name }</p>

                <h6 style={{marginTop: "15px"}}>Designation:</h6>
                <p className="details">{ data["Test"]["Designation"].designation }</p>

                <h6 style={{marginTop: "15px"}}>Opens at:</h6>
                <p className="details">{ new Date(data.opens_at).toString()}</p>

                <h6 style={{marginTop: "15px"}}>Closes at:</h6>
                <p className="details">{ new Date(data.closes_at).toString() }</p>

                <button onClick={ handleVerification } className="btn btn-primary btn-block mt-4 ">{isChecking && <div className="spinner-border text-light"></div> }{!isChecking && "Start test" }</button>
            </div>}
        </div>
     );
}
 
export default StartPage;
