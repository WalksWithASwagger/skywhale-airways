import { products, shopSections } from "./shop-data.js";

const statusLabels = {
  candidate: "Next batch candidate",
  concept: "Concept archive",
  live: "Live drop",
};

function renderCommerceControl(product) {
  if (product.shopify?.enabled) {
    return `<div class="shopify-buy-slot" id="${product.shopify.componentId}" data-shopify-handle="${product.shopify.handle}" data-shopify-state="pending" aria-live="polite">
      <button class="product-buy" type="button" disabled>Shop opening soon</button>
    </div>`;
  }

  const label = statusLabels[product.status] || "Concept archive";
  return `<div class="product-status product-status-${product.status}">${label}</div>`;
}

function renderProduct(product, base) {
  const featuredClass = product.featured ? " product-featured" : "";
  const statusLabel = product.badge || statusLabels[product.status] || "Concept archive";
  return `
    <figure class="product product-${product.status}${featuredClass}">
      <div class="product-img">
        <img src="${base}${product.img}" alt="${product.title}" loading="lazy" />
        <span class="product-badge">${statusLabel}</span>
      </div>
      <figcaption>
        <div class="product-row">
          <span class="product-title">${product.title}</span>
          <span class="product-price">${product.price}</span>
        </div>
        <div class="product-type">${product.type}</div>
        ${renderCommerceControl(product)}
      </figcaption>
    </figure>`;
}

function renderSection(section, base) {
  const sectionProducts = products.filter((product) => product.group === section.group);
  if (!sectionProducts.length) return "";

  return `
    <section class="shop-section shop-section-${section.layout}" aria-labelledby="shop-section-${section.id}">
      <div class="shop-section-heading">
        <p class="shop-eyebrow">${section.eyebrow}</p>
        <h3 id="shop-section-${section.id}">${section.title}</h3>
        <p>${section.description}</p>
      </div>
      <div class="product-grid product-grid-${section.layout}">
        ${sectionProducts.map((product) => renderProduct(product, base)).join("")}
      </div>
    </section>`;
}

// Renders the Duty-Free landing. Shopify mounts into configured slots; all other
// products stay visible as concept/candidate catalog pieces.
export function renderShop(gridEl) {
  const base = import.meta.env.BASE_URL;
  gridEl.innerHTML = shopSections.map((section) => renderSection(section, base)).join("");
}
