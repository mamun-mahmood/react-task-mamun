import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Problem2 = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => navigate("all-contacts")}
              className="btn btn-lg btn-outline-primary"
              type="button"
            >
              All Contacts
            </button>
            <button
              onClick={() => navigate("us-contacts")}
              className="btn btn-lg btn-outline-warning"
              type="button"
            >
              US Contacts
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Problem2;
