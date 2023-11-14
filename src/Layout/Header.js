import React from "react";
import {Link} from "react-router-dom";
import flashcard from "../images/flash-card.png"

function Header() {
  return (
    <header className="jumbotron">
      <div className="container text-white">
        <div className="wrapper">
          <h1 className="display-4 item"><Link to="/" className="text-reset">FlipFlash</Link></h1> 
          <img id="flashcard-img" className="item" src={flashcard} alt="flashcard icon" />
        </div>
        <p className="lead">Create and study flashcards</p>
      </div>
    </header>
  );
}

/* 
Icon credit: <a href="https://www.flaticon.com/free-icons/flash-card" title="flash card icons">Flash card icons created by Freepik - Flaticon</a>
*/


export default Header;
