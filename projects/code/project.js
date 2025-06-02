document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  // Set initial active button & show all cards
  filterButtons.forEach(btn => btn.classList.remove("active"));
  filterButtons[0].classList.add("active");
  cards.forEach(card => card.style.display = "block");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active button UI
      filterButtons.forEach(b => {
        b.classList.remove("active", "btn-warning");
        b.classList.add("btn-outline-warning");
      });
      btn.classList.add("active", "btn-warning");
      btn.classList.remove("btn-outline-warning");

      // Filter cards
      cards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.classList.add("fade-in");
        } else {
          card.style.display = "none";
          card.classList.remove("fade-in");
        }
      });
    });
  });
});
