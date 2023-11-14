import React, { useState } from "react";
import {
  useParams,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { createCard } from "../utils/api";
import CardForm from "./CardForm";

function AddCard({ deck, toggleDeckUpdate }) {
  /*This path: /decks/:deckId/cards/new */
  /*Objective: lets users add cards to a deck one card at a time with a form for the front & back of the card. */

  /*Need deck ID from the parameter to know where to post the card */
  const { deckId } = useParams();

  /*State to keep form data & form values in sync */
  const initialFormData = {
    front: "",
    back: "",
  };
  const [formData, setFormData] = useState({ ...initialFormData });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  /* When form is submitted, create the card via API call and reset form data */
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    async function makeCard() {
      try {
        await createCard(deckId, formData, abortController.signal);
        setFormData({ ...initialFormData });
        /*Call for re-render in parent*/
        toggleDeckUpdate((currentValue) => !currentValue);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error);
        }
      }
    }

    makeCard();
    return () => abortController.abort();
  };


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

  return (
    <main>
      {breadcrumb}
      {title}
      <CardForm
        changeHandler={handleChange}
        submitHandler={handleSubmit}
        card={formData}
        edit={false}
      />
    </main>
  );
}

export default AddCard;
