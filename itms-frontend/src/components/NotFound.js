import { Link } from "react-router-dom"

const NotFound = () => {
    return ( 
        <div className="alert alert-danger text-center p-5 m-5">
            <h2 className="m-5">Requested page not found!</h2>
            <hr/>
            <Link to="/">Go back to homepage...</Link>
        </div>
     );
}
 
export default NotFound
