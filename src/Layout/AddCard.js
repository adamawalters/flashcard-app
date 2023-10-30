import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createCard } from "../utils/api";


function AddCard() {
    /*This path: /decks/:deckId/cards/new */
  const { deckId } = useParams();
  const history = useHistory();

  const initialFormData = {
    front: "",
    back: "",
  };
  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    async function makeCard() {
      try {
        await createCard(deckId, formData, abortController.signal);
        setFormData({...initialFormData});
      } catch (error) {
        if(error.name !== "AbortError") {
            throw error;
        }
      }
    }

    makeCard();
    return () => abortController.abort();
  };

  const title = <h1>React Router: Add Card</h1>;
  
  const form = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="front">Front</label>
      <textarea
        type="text"
        name="front"
        id="front"
        placeholder="Front side of card"
        value={formData.front}
        onChange={handleChange}
      ></textarea>
      <label htmlFor="back">Back</label>
      <textarea
        type="text"
        name="back"
        id="back"
        placeholder="Back side of card"
        value={formData.back}
        onChange={handleChange}
      ></textarea>
      <button className="btn btn-secondary" onClick={()=>history.push(`/decks/${deckId}`)} type="button">
        Done
      </button>
      <button className="btn btn-primary" type="submit">
        Save
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

export default AddCard;
