const SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

function getEnv(key) {
  return import.meta.env[key]?.trim() || "";
}

function markSlot(product, state, label) {
  const slot = document.getElementById(product.shopify.componentId);
  if (!slot) return;
  slot.dataset.shopifyState = state;
  const button = slot.querySelector(".product-buy");
  if (button && label) button.textContent = label;
}

function loadShopifyScript() {
  if (window.ShopifyBuy?.UI) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function productOptions(product) {
  const showOptions = product.shopify.variantMode === "options";
  return {
    product: {
      buttonDestination: "cart",
      contents: {
        img: false,
        title: false,
        price: false,
        description: false,
        quantity: false,
        options: showOptions,
      },
      order: showOptions ? ["options", "button"] : ["button"],
      text: {
        button: "Add to cart",
      },
      styles: {
        product: {
          margin: "0",
          "max-width": "100%",
        },
        button: {
          "background-color": "#c74a5c",
          "border-radius": "4px",
          "font-family": "Georgia, 'Times New Roman', serif",
          "font-size": "12px",
          "letter-spacing": "0.12em",
          "padding": "11px 18px",
          "text-transform": "uppercase",
          ":hover": {
            "background-color": "#b64252",
          },
          ":focus": {
            "background-color": "#b64252",
          },
        },
      },
    },
    cart: {
      popup: false,
      text: {
        title: "Skywhale Duty-Free",
        total: "Subtotal",
        button: "Checkout",
      },
      styles: {
        button: {
          "background-color": "#c74a5c",
          "border-radius": "4px",
          "font-family": "Georgia, 'Times New Roman', serif",
          ":hover": {
            "background-color": "#b64252",
          },
          ":focus": {
            "background-color": "#b64252",
          },
        },
      },
    },
    toggle: {
      styles: {
        toggle: {
          "background-color": "#c74a5c",
          ":hover": {
            "background-color": "#b64252",
          },
          ":focus": {
            "background-color": "#b64252",
          },
        },
      },
    },
  };
}

export async function initializeShopifyBuyButtons(products) {
  const configuredProducts = products.filter((product) => product.shopify?.enabled);
  if (!configuredProducts.length) return { mounted: 0, pending: 0 };

  const domain = getEnv("VITE_SHOPIFY_DOMAIN");
  const storefrontAccessToken = getEnv("VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const readyProducts = configuredProducts
    .map((product) => ({
      product,
      productId: getEnv(product.shopify.productEnv),
      node: document.getElementById(product.shopify.componentId),
    }))
    .filter(({ productId, node }) => productId && node);

  if (!domain || !storefrontAccessToken || readyProducts.length === 0) {
    configuredProducts.forEach((product) =>
      markSlot(product, "pending", "Shop opening soon")
    );
    return {
      mounted: 0,
      pending: configuredProducts.length,
    };
  }

  try {
    await loadShopifyScript();
    const client = window.ShopifyBuy.buildClient({
      domain,
      storefrontAccessToken,
    });
    const ui = await window.ShopifyBuy.UI.onReady(client);

    readyProducts.forEach(({ product, productId, node }) => {
      node.innerHTML = "";
      node.dataset.shopifyState = "ready";
      ui.createComponent("product", {
        id: productId,
        node,
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: productOptions(product),
      });
    });
    return {
      mounted: readyProducts.length,
      pending: configuredProducts.length - readyProducts.length,
    };
  } catch {
    configuredProducts.forEach((product) =>
      markSlot(product, "error", "Shop unavailable")
    );
    return {
      mounted: 0,
      pending: configuredProducts.length,
    };
  }
}
