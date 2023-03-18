import React from "react";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="NotFound text-center">
      <h1 className="mb-4">Oops!</h1>
      <h3 className="mb-4">We couldn't find what you were looking for.</h3>
      <p className="mb-5">But don't worry, we've got you covered.</p>
      <a href="/" className="btn btn-primary">
        Back Home
      </a>
    </div>
  );
}
