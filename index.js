const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
const currentPage = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll("#navLinks li a");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("text-blue-600", "font-bold", "border-b-2");
  }
});
// localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
function updateCartCount() {
  cartCount.innerText = cart.length;
}

updateCartCount();

// loadCategories
const categoryContainer = document.getElementById("categoryContainer");
const productContainer = document.getElementById("productContainer");

async function loadCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  categoryContainer.innerHTML = "";

  // ALL button
  const allBtn = createCategoryBtn("all");
  categoryContainer.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = createCategoryBtn(cat);
    categoryContainer.appendChild(btn);
  });
}
loadCategories().then(() => {
  document.querySelector("#categoryContainer button").click();
});
setTimeout(() => {
  document.querySelector("#categoryContainer button").click();
}, 200);

function createCategoryBtn(category) {
  const btn = document.createElement("button");

  btn.innerText = category;
  btn.className =
    "px-4 py-2 rounded-full border border-gray-300 text-black hover:bg-blue-500 hover:text-white capitalize transition";

  btn.onclick = () => {
    // RESET all buttons to default
    // RESET all buttons
    document.querySelectorAll("#categoryContainer button").forEach((b) => {
      b.classList.remove("bg-blue-600", "text-white");
      b.classList.add("bg-white", "text-black");
    });

    // ACTIVE button → GREEN
    btn.classList.remove("bg-white", "text-black");
    btn.classList.add("bg-blue-600", "text-white");

    // Load products
    if (category === "all") {
      loadProducts();
    } else {
      loadProductsByCategory(category);
    }
  };

  return btn;
}

async function loadProductsByCategory(category) {
  productContainer.innerHTML = productContainer.innerHTML = `
    <div class="col-span-full flex justify-center items-center h-40">
      <p class="text-xl font-semibold text-blue-600">Loading...</p>
    </div>
  `;

  const res = await fetch(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`,
  );

  const data = await res.json();

  if (data.length === 0) {
    productContainer.innerHTML = `
      <p class="text-center text-xl font-semibold text-red-500">
        No Data Found
      </p>
    `;
    return;
  }

  displayProducts(data);
}

async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  // console.log(data);
  displayProducts(data);
}
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// function openModal() {
//   modal.classList.remove("hidden");
//   modal.classList.add("flex");
// }

// function hideModal() {
//   modal.classList.add("hidden");
//   modal.classList.remove("flex");
// }
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

async function loadProductDetails(id) {
  openModal();

  modalContent.innerHTML = `
    <div class="text-center py-10 text-xl font-semibold">
      Loading...
    </div>
  `;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  modalContent.innerHTML = `
    <div class="grid md:grid-cols-1 gap-6  border border-gray-400 p-4">

      <img src="${product.image}" class="h-44 object-contain mx-auto ">

      <div>
        <h2 class="text-2xl font-bold mb-3">${product.title}</h2>

        <p class="text-gray-600 mb-4">${product.description}</p>

        <p class="text-3xl font-bold text-blue-600 mb-2">
          $${product.price}
        </p>

        <p class="text-yellow-500 mb-6 gap-1">
          <i class="fa-solid fa-star text-yellow-500"></i>
           ${product.rating.rate} (${product.rating.count})
        </p>
 <div class="flex gap-2 mt-auto pt-4">

  <button class="flex-1 border rounded py-2 text-sm hover:bg-gray-100 flex items-center justify-center gap-2">
   <i class="fa-solid fa-bolt"></i>
    Buy Now
  </button>
        <button class="flex-1 bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700 flex items-center justify-center gap-2">
         <i class="fa-solid fa-cart-plus text-white"></i>  Cart
        </button>
        </div>
      </div>

    </div>
  `;
}

function displayProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "bg-white shadow rounded-lg flex flex-col";

    card.innerHTML = `
      <img src="${product.image}" class="h-40 object-contain mb-4 bg-gray-100 py-2">

   <div class="px-4 py-2 ">
    <div class= "flex justify-between">
      <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded w-fit capitalize">
        ${product.category}
      </span>
       <p class="text-yellow-500 text-sm gap-1">
         <i class="fa-solid fa-star text-yellow-500"></i>
         ${product.rating.rate} (${product.rating.count})
      </p>

    </div>

      <h3 class="font-semibold mt-2 text-sm">
        ${product.title.slice(0, 40)}...
      </h3>

      <p class="text-lg font-bold mt-2">$${product.price}</p>

    
   <div class="flex gap-2 mt-auto pt-4">

  <button onclick="loadProductDetails(${product.id})" class="flex-1 border rounded py-2 text-sm hover:bg-gray-100 flex items-center justify-center gap-2">
    <i class="fa-solid fa-eye"></i>
    Details
  </button>

  <button class="flex-1 bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700 flex items-center justify-center gap-2">
    <i class="fa-solid fa-cart-plus"></i>
    Add
  </button>

</div>
     </div>
   </div>
    `;

    productContainer.appendChild(card);
  });
}

// call the function
loadCategories();
loadProducts();
