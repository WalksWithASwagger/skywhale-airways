import { galleryPieces } from "./shop-data.js";

const wall = document.getElementById("gallery-wall");
const base = import.meta.env.BASE_URL;

wall.innerHTML = galleryPieces
  .map(
    (piece) => `
    <figure class="piece">
      <img src="${base}${piece.img}" alt="${piece.title}" loading="lazy" />
      <figcaption>
        <span class="piece-title">${piece.title}</span>
        <span class="piece-note">${piece.note}</span>
      </figcaption>
    </figure>`
  )
  .join("");
