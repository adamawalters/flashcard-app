import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck, readCard, updateCard } from "../utils/api";

function EditCard() {
  /*This path: /decks/:deckId/cards/:cardId/edit */
  /*This is a form that lets you edit a card within a deck */

  /*Gets deckID from URL for API call */
  const { deckId, cardId } = useParams();

  /*Needs info about the current deck for the breadcrumb  */
  const [deck, setDeck] = useState({});
  const [card, setCard] = useState({});
  const history = useHistory();

  /*Read deck from API - */
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

  /*Read deck from API */
  useEffect(() => {
    readDeckFromAPI();
  }, []);

  /*Reusable function to read card from API - needs this to pre-fill the card state & form*/
  const readCardFromAPI = () => {
    setCard({});
    const abortController = new AbortController();
    async function loadCard() {
      try {
        const cardFromApi = await readCard(cardId, abortController.signal);
        setCard(cardFromApi);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadCard();
    return () => abortController.abort();
  };

  /*Read Card from API */
  useEffect(() => {
    readCardFromAPI();
  }, []);

  /*Event handler when form is submitted. Post the card to the API.  */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    async function makeCard() {
      try {
        await updateCard(card, abortController.signal);
        history.push(`/decks/${deckId}`);
        //setFormData({...initialFormData});
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    makeCard();
    return () => abortController.abort();
  };

  /*Keep card form data up to date with state */
  const handleChange = (event) => {
    setCard({ ...card, [event.target.name]: event.target.value });
  };

  /* When both card & deck API calls are done, create markup */
  if (card.id && deck.id) {
    
    const title = <h1>{deck.name}: Edit Card</h1>;

    const form = (
      <form onSubmit={handleSubmit}>
        <label htmlFor="front">Front</label>
        <textarea
          type="text"
          name="front"
          id="front"
          placeholder="Front side of card"
          value={card.front}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="back">Back</label>
        <textarea
          type="text"
          name="back"
          id="back"
          placeholder="Back side of card"
          value={card.back}
          onChange={handleChange}
        ></textarea>
        <button
          className="btn btn-secondary"
          onClick={() => history.push(`/decks/${deckId}`)}
          type="button"
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    );

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
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
    );

    return (
      <main>
        {breadcrumb}
        {title}
        {form}
      </main>
    );
  }

  return "Loading";
}

export default EditCard;
