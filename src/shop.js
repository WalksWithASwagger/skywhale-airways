import { products } from "./shop-data.js";

// Renders the Duty-Free shop grid. Shopify mounts into configured slots; all
// other products stay concept-only until their fulfillment path is chosen.
export function renderShop(gridEl) {
  const base = import.meta.env.BASE_URL;
  gridEl.innerHTML = products
    .map(
      (p) => {
        const buyControl = p.shopify?.enabled
          ? `<div class="shopify-buy-slot" id="${p.shopify.componentId}" data-shopify-handle="${p.shopify.handle}" data-shopify-state="pending" aria-live="polite">
              <button class="product-buy" type="button" disabled>Shop opening soon</button>
            </div>`
          : `<button class="product-buy" type="button" disabled>Boarding soon</button>`;
        return `
      <figure class="product">
        <div class="product-img"><img src="${base}${p.img}" alt="${p.title}" loading="lazy" /></div>
        <figcaption>
          <div class="product-row">
            <span class="product-title">${p.title}</span>
            <span class="product-price">${p.price}</span>
          </div>
          <div class="product-type">${p.type}</div>
          ${buyControl}
        </figcaption>
      </figure>`;
      }
    )
    .join("");
}
