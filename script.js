
// ================================
// 1. MOBILE NAVIGATION
// ================================
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

// ================================
// 2. FOOTER YEAR
// ================================
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ================================
// 3. EVIDENCE GALLERY
// ================================
const modal = document.getElementById("evidence-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalImage = document.getElementById("modal-image");

let currentImages = [];
let currentImageIndex = 0;

// Buat tombol navigasi galeri secara otomatis
const galleryControls = document.createElement("div");
galleryControls.className = "gallery-controls";

galleryControls.innerHTML = `
  <button class="gallery-button gallery-prev"
          type="button"
          aria-label="Foto sebelumnya">‹</button>

  <span class="gallery-counter">1 / 1</span>

  <button class="gallery-button gallery-next"
          type="button"
          aria-label="Foto berikutnya">›</button>
`;

modalImage.appendChild(galleryControls);

const prevButton = galleryControls.querySelector(".gallery-prev");
const nextButton = galleryControls.querySelector(".gallery-next");
const counter = galleryControls.querySelector(".gallery-counter");

function showGalleryImage() {
  const image = currentImages[currentImageIndex];

  if (!image) {
    modalImage.style.backgroundImage = "";
    modalImage.querySelector("span").style.display = "block";
    galleryControls.style.display = "none";
    return;
  }

  modalImage.style.backgroundImage = `url("${image}")`;
  modalImage.querySelector("span").style.display = "none";

  counter.textContent =
    `${currentImageIndex + 1} / ${currentImages.length}`;

  galleryControls.style.display =
    currentImages.length > 1 ? "flex" : "none";
}

function openGallery(card) {
  modalTitle.textContent = card.dataset.title;
  modalDescription.textContent = card.dataset.description;

  // Membaca beberapa foto dari data-images
  // Tetap mendukung data-image dari kode lama
  const images = card.dataset.images || card.dataset.image || "";

  currentImages = images
    .split("|")
    .map(image => image.trim())
    .filter(image => image !== "");

  currentImageIndex = 0;

  showGalleryImage();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

document.querySelectorAll(".evidence-card").forEach(card => {
  card.addEventListener("click", () => openGallery(card));
});

// Tombol foto sebelumnya
prevButton.addEventListener("click", () => {
  if (currentImages.length <= 1) return;

  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) %
    currentImages.length;

  showGalleryImage();
});

// Tombol foto berikutnya
nextButton.addEventListener("click", () => {
  if (currentImages.length <= 1) return;

  currentImageIndex =
    (currentImageIndex + 1) % currentImages.length;

  showGalleryImage();
});

// Tutup modal
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  currentImages = [];
  currentImageIndex = 0;
}

modal.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closeModal);
});

// Keyboard: Escape untuk menutup, panah untuk ganti foto
document.addEventListener("keydown", event => {
  if (!modal.classList.contains("open")) return;

  if (event.key === "Escape") closeModal();

  if (event.key === "ArrowLeft") {
    prevButton.click();
  }

  if (event.key === "ArrowRight") {
    nextButton.click();
  }
});

// ================================
// 4. ACTIVE NAVIGATION
// ================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px"
});

sections.forEach(section => observer.observe(section));
