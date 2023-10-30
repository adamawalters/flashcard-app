import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouteMatch,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck, updateDeck } from "../utils/api";

function EditDeck() {
  /*path: /decks/:deckId/edit */
  /*Perhaps get loadDecks from Home page so that home page is always updated */

  const { deckId } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  /*Read from existing deck once */
  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const deckFromApi = await readDeck(deckId, abortController.signal);
        setFormData(deckFromApi);
      } catch (error) {
        if (error.name != "AbortError") {
          throw error;
        }
      }
    }
    loadDeck();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  
  /*Runs when updated deck data is submitted. Posts to server and goes to deck page */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController()
    
    async function makeDeck() {
        try{
            const response = await updateDeck(formData, abortController.signal);
            //setFormData({initialFormData})
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
  

  const title = <h1>Edit Deck</h1>;
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
        onClick={() => history.push(`/decks/${deckId}`)}
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

export default EditDeck;
