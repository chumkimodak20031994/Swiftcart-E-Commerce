// ================= NAVBAR MENU =================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Active nav link
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll("#navLinks li a");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("text-blue-600", "font-bold", "border-b-2");
  }
});

// ================= CART SYSTEM =================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Store all products globally
let allProducts = [];

// Update navbar cart count
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = cart.length;
}
updateCartCount();

// Add to cart
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

  alert("Added to Cart ✅");
}

// ================= CATEGORY + PRODUCT =================

const categoryContainer = document.getElementById("categoryContainer");
const productContainer = document.getElementById("productContainer");

// Load Categories
async function loadCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  categoryContainer.innerHTML = "";

  const allBtn = createCategoryBtn("all");
  categoryContainer.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = createCategoryBtn(cat);
    categoryContainer.appendChild(btn);
  });

  // Auto click first button
  setTimeout(() => {
    document.querySelector("#categoryContainer button").click();
  }, 200);
}

// Create category button
function createCategoryBtn(category) {
  const btn = document.createElement("button");

  btn.innerText = category;
  btn.className =
    "px-4 py-2 rounded-full border border-gray-300 bg-white text-black hover:bg-blue-500 hover:text-white capitalize";

  btn.onclick = () => {
    // Reset styles
    document.querySelectorAll("#categoryContainer button").forEach((b) => {
      b.classList.remove("bg-blue-600", "text-white");
      b.classList.add("bg-white", "text-black");
    });

    btn.classList.add("bg-blue-600", "text-white");

    if (category === "all") loadProducts();
    else loadProductsByCategory(category);
  };

  return btn;
}

// Load all products
async function loadProducts() {
  productContainer.innerHTML = loadingHTML();

  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  allProducts = data;
  displayProducts(data);
}

// Load products by category
async function loadProductsByCategory(category) {
  productContainer.innerHTML = loadingHTML();

  const res = await fetch(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`,
  );

  const data = await res.json();

  allProducts = data;

  if (data.length === 0) {
    productContainer.innerHTML = noDataHTML();
    return;
  }

  displayProducts(data);
}

// Loading UI
function loadingHTML() {
  return `
    <div class="col-span-full flex justify-center items-center h-40">
      <p class="text-xl font-semibold text-blue-600">Loading...</p>
    </div>`;
}

// No data UI
function noDataHTML() {
  return `
    <p class="text-center text-xl font-semibold text-red-500">
      No Data Found
    </p>`;
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

closeModal.onclick = hideModal;

modal.onclick = (e) => {
  if (e.target === modal) hideModal();
};

// Load product details
async function loadProductDetails(id) {
  openModal();

  modalContent.innerHTML = `
    <div class="text-center py-10 text-xl font-semibold">Loading...</div>`;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  modalContent.innerHTML = `
    <div class="grid gap-6 border p-4">

      <img src="${product.image}" class="h-44 object-contain mx-auto">

      <div>
        <h2 class="text-2xl font-bold mb-3">${product.title}</h2>

        <p class="text-gray-600 mb-4">${product.description}</p>

        <p class="text-3xl font-bold text-blue-600 mb-2">$${product.price}</p>

        <p class="text-yellow-500 mb-6">
          ⭐ ${product.rating.rate} (${product.rating.count})
        </p>

        <div class="flex gap-2">
          <button class="flex-1 border rounded py-2">Buy Now</button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-blue-600 text-white rounded py-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

// ================= DISPLAY PRODUCTS =================

function displayProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "bg-white shadow rounded-lg flex flex-col";

    card.innerHTML = `
      <img src="${product.image}" class="h-40 object-contain mb-4 bg-gray-100 py-2">

      <div class="px-4 py-2">
        <div class="flex justify-between">
          <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded capitalize">
            ${product.category}
          </span>

          <p class="text-yellow-500 text-sm">
            ⭐ ${product.rating.rate}
          </p>
        </div>

        <h3 class="font-semibold mt-2 text-sm">
          ${product.title.slice(0, 40)}...
        </h3>

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

// ================= INIT =================

loadCategories();
loadProducts();
