import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  const [actor, setBook] = useState({
    id: "",
    firstname: "",
    lastname: null,
  });
  const [error,setError] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();

  const actor_id = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3001/first/${actor_id}`, actor);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Actor</h1>
      <input
        type="text"
        placeholder="Actor ID"
        name="id"
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="first name"
        name="firstname"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="last name"
        name="lastname"
        onChange={handleChange}
      />
      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/first">See all books</Link>
    </div>
  );
};

export default Update;