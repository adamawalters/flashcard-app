import React from "react";
import {Link} from "react-router-dom";

function Header() {
  return (
    <header className="jumbotron" >
      <div className="container text-white">
        <h1 className="display-4"><Link to="/" className="text-reset">FlipFlash</Link></h1> 
        <p className="lead">Create and study flashcards</p>
      </div>
    </header>
  );
}

export default Header;
