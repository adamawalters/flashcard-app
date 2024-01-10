import React, { useState, useReducer } from "react";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { createDeck } from "../../utils/api";

function CreateDeck({setDeckRerender}) {
  /*Path: /decks/new */
  /*Objective: Lets users create a  new deck with a form with a deck name & description. Form Data is saved in the state and uploaded to the server on submission. */

  const initialFormData = {
    name: "",
    description: "",
  };

  const history = useHistory();

  const [formData, setFormData] = useState({ ...initialFormData });
  

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name] : event.target.value})
  }

  /*Activated when form is submitted. Posts the new deck to the server, resets form data, and navigates to decks page */
  const handleSubmit = async (event) => {
    event.preventDefault();

        try{
            const response = await createDeck(formData);
            /*Toggle refresh on home page */
            setFormData({...initialFormData})
            const id = response.id;
            setDeckRerender((currentValue) => !currentValue);
            history.push(`/decks/${id}`);
        } catch(error) {
            if(error.name !== "AbortError") {
                throw Error;
            }
        }

  }

/*Breadcrumb, title and markup created here */
  
  const breadcrumb = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item" aria-current="page">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Create Deck
        </li>
      </ol>
    </nav>
  );

  
  const title = <h1>Create Deck</h1>;
  const form = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Deck Name"
        value={formData.name}
        onChange={handleChange}
        required
      ></input>
      <label htmlFor="description">Description</label>
      <textarea
        rows="5"
        id="description"
        name="description"
        placeholder="Brief description of deck"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => history.push("/")}
      >
        Cancel
      </button>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );

  return (
    <main>
      {breadcrumb}
      {title}
      {form}
    </main>
  );
}

export default CreateDeck;
