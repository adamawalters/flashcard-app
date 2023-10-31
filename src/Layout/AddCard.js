import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { createCard, readDeck } from "../utils/api";


function AddCard() {
    /*This path: /decks/:deckId/cards/new */
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({});

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

  const readDeckFromAPI = () => {
    setDeck({});
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const deckFromApi = await readDeck(deckId, abortController.signal);
        setDeck(deckFromApi);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadDeck();
    return () => abortController.abort();
  };

  useEffect(()=>{
    readDeckFromAPI();
  }, [])

  
  
  if(deck.id) { 
      const breadcrumb = (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item" aria-current="page">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Card
            </li>
          </ol>
        </nav>
      );


      const title = <h1>{deck.name}: Add Card</h1>;
      
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
          {breadcrumb}
          {title}
          {form}
        </div>
      );
    }

    return "Loading"

  }

export default AddCard;
