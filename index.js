// ================= NAVBAR MENU =================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Active nav link
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll("#navLinks li a");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("text-blue-600", "font-bold", "border-b-2");
  }
});

// ================= CART SYSTEM =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = cart.length;
}
updateCartCount();

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const exists = cart.find((item) => item.id === id);
  if (exists) {
    alert("Already added to cart!");
    return;
  }

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to Cart");
}

// ================= UI HELPERS =================
function loadingHTML() {
  return `
    <div class="col-span-full flex justify-center items-center h-40">
      <p class="text-xl font-semibold text-blue-600">Loading...</p>
    </div>`;
}

function noDataHTML() {
  return `
    <p class="text-center text-xl font-semibold text-red-500">
      No Data Found
    </p>`;
}

// ================= CATEGORY + PRODUCTS =================
const categoryContainer = document.getElementById("categoryContainer");
const productContainer = document.getElementById("productContainer");

async function loadCategories() {
  if (!categoryContainer) return;

  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  categoryContainer.innerHTML = "";

  const allBtn = createCategoryBtn("all");
  categoryContainer.appendChild(allBtn);

  data.forEach((cat) => {
    categoryContainer.appendChild(createCategoryBtn(cat));
  });

  setTimeout(() => {
    categoryContainer.querySelector("button").click();
  }, 200);
}

function createCategoryBtn(category) {
  const btn = document.createElement("button");

  btn.innerText = category;
  btn.className =
    "px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-blue-500 hover:text-white capitalize";
  btn.className =
    "px-4 py-2 rounded-full border border-gray-300 bg-white text-black hover:bg-blue-500 hover:text-white capitalize";

  btn.onclick = () => {
    document.querySelectorAll("#categoryContainer button").forEach((b) => {
      b.classList.remove("bg-blue-600", "text-white");
      b.classList.add("bg-white", "text-black");
    });

    btn.classList.remove("bg-white", "text-black");
    btn.classList.add("bg-blue-600", "text-white");

    // Load products
    if (category === "all") loadProducts();
    else loadProductsByCategory(category);
  };
  return btn;
}

async function loadProducts() {
  if (!productContainer) return;

  productContainer.innerHTML = loadingHTML();

  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  allProducts = data;
  displayProducts(data);
}

async function loadProductsByCategory(category) {
  productContainer.innerHTML = loadingHTML();

  const res = await fetch(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`,
  );
  const data = await res.json();

  allProducts = data;

  if (!data.length) {
    productContainer.innerHTML = noDataHTML();
    return;
  }

  displayProducts(data);
}

// ================= DISPLAY PRODUCTS =================
function displayProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "bg-white shadow rounded-lg flex flex-col";

    card.innerHTML = `
      <img src="${product.image}" class="h-40 object-contain bg-gray-100 py-2">

      <div class="p-4">
        <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize">
          ${product.category}
        </span>

        <h3 class="font-semibold mt-2 text-sm">
          ${product.title.slice(0, 40)}...
        </h3>

        <p class="text-yellow-500 text-sm gap-1"> <i class="fa-solid fa-star text-yellow-500"></i> ${product.rating.rate} (${product.rating.count}) </p>
        <p class="text-lg font-bold mt-2">$${product.price}</p>

         <div class="flex gap-2 mt-4">
          <button onclick="loadProductDetails(${product.id})"
            class="flex-1 border rounded py-2 text-sm">
            Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-blue-600 text-white rounded py-2 text-sm">
            Add
          </button>
        </div>
      </div>
    `;

    productContainer.appendChild(card);
  });
}

// ================= PRODUCT MODAL =================
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

function openModal() {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function hideModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

if (closeModal) closeModal.onclick = hideModal;

if (modal) {
  modal.onclick = (e) => {
    if (e.target === modal) hideModal();
  };
}

async function loadProductDetails(id) {
  openModal();

  modalContent.innerHTML = `<div class="text-center py-10 text-xl font-semibold">Loading...</div>`;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  modalContent.innerHTML = `
     <div class="grid gap-6 border p-4">

      <img src="${product.image}" class="h-44 object-contain mx-auto">

      <div>
        <h2 class="text-2xl font-bold mb-3">${product.title}</h2>

        <p class="text-gray-600 mb-4">${product.description}</p>

        <p class="text-3xl font-bold text-blue-600 mb-2">$${product.price}</p>

      <p class="text-yellow-500 text-sm gap-1"> <i class="fa-solid fa-star text-yellow-500"></i> ${product.rating.rate} (${product.rating.count}) </p>

        <div class="flex gap-2 mt-2">
          <button class="flex-1 border rounded py-2">Buy Now</button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-blue-600 text-white rounded py-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

// ================= TRENDING PRODUCTS =================
async function loadTrendingProducts() {
  const container = document.getElementById("trendingContainer");
  if (!container) return;

  container.innerHTML = loadingHTML();

  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  allProducts = products;

  const topRated = [...products]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 3);

  container.innerHTML = "";

  topRated.forEach((product) => {
    const card = document.createElement("div");

    card.className = "bg-white shadow rounded-lg flex flex-col";
    container.innerHTML += `
      <div class="bg-white shadow rounded-lg p-4 item-center">
       <img src="${product.image}" class="h-40 object-contain mb-4 p-4 py-2 mx-auto">
 <div class="flex justify-between">
          <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize">
            ${product.category}
          </span>

      <p class="text-yellow-500 text-sm gap-1"> <i class="fa-solid fa-star text-yellow-500"></i> ${product.rating.rate} (${product.rating.count}) </p>
        </div>
        <h3 class="text-sm font-semibold">
          ${product.title.slice(0, 50)}...
        </h3>

      <div class="flex gap-2 mt-4">
          <button onclick="loadProductDetails(${product.id})"
            class="flex-1 border rounded py-2 text-sm">
            Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-blue-600 text-white rounded py-2 text-sm">
            Add
          </button>
        </div>
      </div>
    `;
  });
}

// ================= PAGE LOAD =================
loadCategories();
loadProducts();
loadTrendingProducts();
