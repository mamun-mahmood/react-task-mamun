import React, { useEffect, useRef, useState } from "react";
import ModalC from "./ModaC";
import { useNavigate } from "react-router-dom";
function ModalB() {
  const [contacts, setContacts] = useState([]);
  const loadingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [fetchUrl, setFetchUrl] = useState(null);
  const [fetchMore, setFetchMore] = useState(true);
  const inputRef = useRef(null);
  const fetchContacts = () => {
    fetch(`https://contact.mediusware.com/api/country-contacts/bangladesh/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setContacts((prev) => [...prev, ...data.results]);
        setPage((prev) => prev + 1);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchContacts();
  }, [pageSize]);
  useEffect(() => {
    // Intersection Observer for infinite scrolling
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // fecth more search results if fetchUrl is set
          if (fetchUrl && fetchMore) {
            fetchMoreSearchResults();
          } else if (fetchMore) fetchContacts();
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
  }, [contacts]);
  
  const searchContacts = async () => {
    await fetch(
      `https://contact.mediusware.com/api/country-contacts/bangladesh/?search=${inputRef?.current.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.results);
        if (data?.next) {
          setFetchUrl(data.next);
          setFetchMore(true);
        }
        console.log(data);
      })
      .catch((err) => console.log(err.message));
  };
  const fetchMoreSearchResults = async () => {
    await fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setContacts((prev) => [...prev, ...data.results]);
        if (data?.next) {
          setFetchUrl(data.next);
        } else {
          setFetchUrl(null);
          setFetchMore(false);
        }
      })
      .catch((err) => console.log(err.message));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef?.current?.value) searchContacts();
    else fetchContacts();
  };
  const handleChange = (e) => {
    setTimeout(() => {
      searchContacts();
    }, 2000);
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
        <h2>Modal A</h2>
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
            // justifyContent: "center",
            alignItems: "center",
            marginTop: "5px",
          }}
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            style={{
              marginTop: "5px",
              borderRadius: "5px",
              outline: "none",
              padding: "5px",
            }}
            onChange={handleChange}
          />
          <button
            disabled={!inputRef?.current?.value}
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
            overflowY: "scroll",
            height: "60%",
            paddingBottom: "20px",
          }}
        >
          {/* Map through contacts and display them */}
          {!showEven
            ? contacts?.map((contact) => (
                <ModalC contact={contact} key={contact.id} />
              ))
            : contacts
                .filter((contact) => contact.id % 2 === 0)
                .map((contact) => (
                  <ModalC contact={contact} key={contact.id} />
                ))}

          {contacts.length > 19 && (
            <p ref={loadingRef}>
              {fetchMore ? "Loading more data..." : "No more data to load"}
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
