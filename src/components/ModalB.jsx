import React, { useEffect, useRef, useState } from "react";
import ModalC from "./ModaC";
import { useNavigate } from "react-router-dom";
function ModalB() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const loadingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const fetchContacts = () => {
    fetch(
      `https://contact.mediusware.com/api/country-contacts/usa?page=${page}&search=${searchTerm}&page_size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.data);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchContacts();
    // Create the Intersection Observer
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setPage((prev) => prev + 1);
          fetchContacts();
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `https://contact.mediusware.com/api/country-contacts/usa?page=${page}&search=${searchTerm}&page_size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.data);
      })
      .catch((err) => console.log(err.message));
  };
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      handleSubmit(e);
    }, 1000);
  };
  const navigate = useNavigate();
  const [showEven, setShowEven] = useState(false);
  return (
    <>
      <div
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          padding: "2rem",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: "80%",
          borderRadius: "1rem",
          zIndex: 10,
        }}
      >
        <h2>Modal B</h2>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline"
            style={{
              backgroundColor: "#46139f",
            }}
            onClick={() => navigate("/problem-2/all-contacts")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline"
            style={{
              backgroundColor: "#ff7f50",
            }}
          >
            US Contacts
          </button>
          <button
            className="btn btn-lg btn-outline"
            style={{
              backgroundColor: "#46139f",
            }}
            onClick={() => navigate("/problem-2")}
          >
            Close
          </button>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5px",
          }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search"
            style={{
              marginTop: "5px",
              borderRadius: "5px",
              outline: "none",
              padding: "5px",
            }}
            onChange={handleChange}
            defaultValue={searchTerm}
          />
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            style={{ marginTop: "5px" }}
          >
            Search
          </button>
        </form>
        <ul
          style={{
            marginTop: "5px",
          }}
        >
          {/* Map through contacts and display them */}
          {!showEven
            ? contacts.map((contact) => (
                <ModalC contact={contact} key={contact.id} />
              ))
            : contacts
                .filter((contact) => contact.id % 2 === 0)
                .map((contact) => (
                  <ModalC contact={contact} key={contact.id} />
                ))}
          {contacts.length > 10 && (
            <p ref={loadingRef}>
              {isVisible ? "Loading more data..." : "Scroll to load more"}
            </p>
          )}
        </ul>
        <label htmlFor="showeven">Show even only</label>
        <input
          type="checkbox"
          name=""
          id="showeven"
          style={{
            width: "40px",
          }}
          onChange={() => setShowEven(!showEven)}
          defaultChecked={showEven}
        />
      </div>
    </>
  );
}

export default ModalB;
