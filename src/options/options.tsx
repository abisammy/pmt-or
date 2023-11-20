// import { addHTMLButton } from "../utils";
// import { loadWebsites, websites } from "../websites";

// const table = document.getElementById("websites") as HTMLTableElement;
// const create = document.getElementById("create") as HTMLFormElement;

// let createForm = false;

// const renderTable = () => {
//     table.style.display = "block";
//     for (const website of websites) {
//         const row = table.insertRow();
//         const name = row.insertCell();
//         name.innerHTML = website[1].name;
//         addHTMLButton(row.insertCell(), "Edit");
//         addHTMLButton(row.insertCell(), "Delete");
//     }
// };

// create.addEventListener("submit", (data) => {
//     console.log("HELLO WORLD`");
//     // console.log(data.)
// });

// const main = async () => {
//     await loadWebsites();
//     renderTable();

//     if (!table.parentNode) return;
//     addHTMLButton(table.parentNode, "Add website", (button) => {
//         button.addEventListener("click", () => {
//             if (!createForm) {
//                 create.style.display = "block";
//                 table.style.display = "none";
//             } else {
//                 create.style.display = "none";
//                 renderTable();
//             }

//             createForm = !createForm;
//         });
//     });
// };

// main();

import React from "react";
import ReactDOM from "react-dom";
import { Test } from "./test";

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.render(<Test />, rootElement);
}
