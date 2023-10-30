import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createDeck } from "../utils/api";

function CreateDeck() {
  /*path: /decks/new */
  const initialFormData = {
    name: "",
    description: "",
  };
  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name] : event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController()

    async function makeDeck() {
        try{
            const response = await createDeck(formData, abortController.signal);
            setFormData({initialFormData})
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
    <div>
      {title}
      {form}
    </div>
  );
}

export default CreateDeck;
