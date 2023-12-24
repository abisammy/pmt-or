import React from "react";
import { createRoot } from "react-dom/client";
import Options from ".";

const container = document.getElementById("root");

const root = createRoot(container);
root.render(<Options />);
