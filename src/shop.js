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

// The current drop gets a single hero presentation instead of a grid cell.
function renderHeroProduct(product, base) {
  return `
    <figure class="product product-hero">
      <div class="product-hero-img">
        <img src="${base}${product.img}" alt="${product.title}" loading="lazy" />
      </div>
      <figcaption class="product-hero-info">
        <span class="product-badge product-hero-badge">${product.badge}</span>
        <h4 class="product-hero-title">${product.title}</h4>
        <p class="product-hero-type">${product.type}</p>
        <div class="product-hero-buy">
          <span class="product-hero-price">${product.price}</span>
          ${renderCommerceControl(product)}
        </div>
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
        ${sectionProducts
          .map((product) =>
            section.layout === "drop" ? renderHeroProduct(product, base) : renderProduct(product, base)
          )
          .join("")}
      </div>
    </section>`;
}

// Renders the Duty-Free landing. Shopify mounts into configured slots; all other
// products stay visible as concept/candidate catalog pieces.
export function renderShop(gridEl) {
  const base = import.meta.env.BASE_URL;
  const galleryLink = `
    <a class="gallery-invite" href="gallery.html">
      <span class="gallery-invite-eyebrow">Concept gallery</span>
      <span class="gallery-invite-title">Browse the terminal's other relics →</span>
      <span class="gallery-invite-sub">Patches, pins, lyric die-cuts, and time-airport fragments — art first, souvenirs someday.</span>
    </a>`;
  gridEl.innerHTML = shopSections.map((section) => renderSection(section, base)).join("") + galleryLink;
}
