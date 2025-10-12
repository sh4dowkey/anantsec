// Fetch and render certificates
fetch("data/certificates.json")
  .then(res => res.json())
  .then(data => {
    const certGrid = document.getElementById("certificates-grid");
    const jobsimGrid = document.getElementById("jobsim-grid");
    const badgeGrid = document.getElementById("badges-grid");

    // Create certificate card
    const createCard = (item, type) => {
      const card = document.createElement("div");
      card.className = "cert-card";

      const imageContainer = document.createElement("div");
      imageContainer.className = "cert-image-container";

      const badge = document.createElement("div");
      badge.className = "cert-badge";
      badge.textContent = type;
      imageContainer.appendChild(badge);

      const img = document.createElement("img");
      img.src = `assets/certificates/${item.file}`;
      img.alt = item.title || "Certificate";
      img.loading = "lazy";

      // Click to view fullscreen
      img.onclick = () => openModal(img.src);

      imageContainer.appendChild(img);
      card.appendChild(imageContainer);

      const content = document.createElement("div");
      content.className = "cert-content";

      const title = document.createElement("h3");
      title.className = "cert-title";
      title.textContent = item.title || "Certificate";

      const issuer = document.createElement("p");
      issuer.className = "cert-issuer";
      issuer.innerHTML = `<i class="fas fa-building"></i> ${item.issuer || "Unknown"}`;

      content.appendChild(title);
      content.appendChild(issuer);
      card.appendChild(content);

      return card;
    };

    // Render certificates
    data.certificates.forEach(cert =>
      certGrid.appendChild(createCard(cert, 'Certified'))
    );

    // Render job simulations
    data.jobsim.forEach(jobsim =>
      jobsimGrid.appendChild(createCard(jobsim, 'Simulation'))
    );

    // Render badges
    data.badges.forEach(badge =>
      badgeGrid.appendChild(createCard(badge, 'Badge'))
    );
  })
  .catch(err => {
    console.error("❌ Failed to load certificates:", err);
  });

// Modal functionality
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');

function openModal(src) {
  modalImage.src = src;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});