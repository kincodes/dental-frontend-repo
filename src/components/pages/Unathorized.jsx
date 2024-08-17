import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MissingAuth.css";

const Unathorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <article className="missing-unauth" style={{ padding: "100px" }}>
      <div className="message">
        <h1>Unauthorized Access</h1>
        {"\n"}
        <p>Please contact your administrator.</p>
        {"\n"}
      </div>

      <div className="flexGrow">
        <button className="back-button" onClick={goBack}>
          Go Back
        </button>
      </div>
    </article>
  );
};

export default Unathorized;
