import { useNavigate } from "react-router-dom";
import "../../styles/MissingAuth.css";

const Missing = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <article  className='missing-unauth' style={{ padding: "100px" }}>
      <div className="message">
        <div>
        <h1>Oops!</h1>
        <p>Page Not Found</p>
        </div>
        <div className="flexGrow">
          <button className="back-button" onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>
    </article>
  );
};

export default Missing;
