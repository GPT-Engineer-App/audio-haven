import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import posthog from 'posthog-js';

posthog.init('phc_td6GEht3zMTMsYF7uP8rct2M99OHe90hR9sYKFKpC7s', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
