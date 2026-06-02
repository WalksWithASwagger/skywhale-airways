import { products } from "./shop-data.js";

// Renders the Duty-Free shop grid. Buy is intentionally a placeholder until a
// fulfillment provider is chosen — buttons announce, they don't transact.
export function renderShop(gridEl) {
  const base = import.meta.env.BASE_URL;
  gridEl.innerHTML = products
    .map(
      (p) => `
      <figure class="product">
        <div class="product-img"><img src="${base}${p.img}" alt="${p.title}" loading="lazy" /></div>
        <figcaption>
          <div class="product-row">
            <span class="product-title">${p.title}</span>
            <span class="product-price">${p.price}</span>
          </div>
          <div class="product-type">${p.type}</div>
          <button class="product-buy" type="button" disabled>Boarding soon</button>
        </figcaption>
      </figure>`
    )
    .join("");
}
