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
