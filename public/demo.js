const tankGrid = document.getElementById("tankGrid");
const searchInput = document.getElementById("searchInput");

let allTanks = [];

// Fetch tanks from same-origin API
async function fetchTanks() {
  try {
    const response = await fetch("/tanks"); // ← Same server, no CORS!
    if (!response.ok) throw new Error("Network response was not ok");
    allTanks = await response.json();
    renderTanks(allTanks);
  } catch (error) {
    tankGrid.innerHTML = `<p class="error">❌ Failed to load tanks.</p>`;
    console.error("Fetch error:", error);
  }
}

// Render tanks as cards
function renderTanks(tanks) {
  if (tanks.length === 0) {
    tankGrid.innerHTML = `<p class="loading">No tanks found. Try a different search.</p>`;
    return;
  }

  tankGrid.innerHTML = tanks
    .map(
      (tank) => `
        <div class="tank-card">
            <img class="tank-image" src="${tank.image_url}" alt="${tank.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <h3 class="tank-title">${tank.name}</h3>
            <p class="tank-country">Country: <span>${tank.country}</span></p>
            <p class="tank-era">Era: <span>${tank.era}</span></p>
        </div>
    `
    )
    .join("");
}

// Live search
searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase().trim();
  if (!term) {
    renderTanks(allTanks);
    return;
  }

  const filtered = allTanks.filter(
    (tank) =>
      tank.name.toLowerCase().includes(term) ||
      tank.country.toLowerCase().includes(term) ||
      tank.era.toLowerCase().includes(term)
  );

  renderTanks(filtered);
});

// Initialize
fetchTanks();
