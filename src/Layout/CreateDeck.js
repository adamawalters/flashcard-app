import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { createDeck } from "../utils/api";

function CreateDeck() {
  /*path: /decks/new */
  /*Objective: Lets users create a  new deck with a form with a deck name & description. Form Data is saved in the state and uploaded to the server on submission. */

  /*This object is used to set the initial formData state and reset the formData post submission */
  const initialFormData = {
    name: "",
    description: "",
  };

  /*History is used to go to the new decks screen after submit, or to go home when cancelling creation */
  const history = useHistory();

  const [formData, setFormData] = useState({ ...initialFormData });

  /*Keeps form values in sync with state values when form values change*/
  const handleChange = (event) => {
    setFormData({...formData, [event.target.name] : event.target.value})
  }

  /*Activated when form is submitted. Posts the new deck to the server, resets form data, and navigates to decks page */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController()

    async function makeDeck() {
        try{
            const response = await createDeck(formData, abortController.signal);
            /*Essential below to keep form controlled "..." */
            setFormData({...initialFormData})
            const id = response.id;
            history.push(`/decks/${id}`)
        } catch(error) {
            if(error.name !== "AbortError") {
                throw Error;
            }
        }

    }

    makeDeck();
    return () => abortController.abort();
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
