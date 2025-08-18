// DOM Elements - Updated selectors for new UI
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const linkInput = document.getElementById("link");
const saveButton = document.getElementById("saveButton");
const searchBtn = document.getElementById("searchBtn");
const recentLinksContainer = document.getElementById("recentLinksContainer");

// Initialize links array from localStorage or create empty array
let links = JSON.parse(localStorage.getItem("links")) || [];

// Save link function with URL validation
saveButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  let url = linkInput.value.trim();

  if (!title || !url) {
    showAlert("Title and Link are required!", "error");
    return;
  }

  // Validate URL format
  if (!url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[^\s]*)?(#[^\s]*)?$/)) {
    showAlert("Please enter a valid URL (e.g., http://example.com or example.com)", "error");
    return;
  }

  // Add https:// if not present
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Create new link object
  const newLink = {
    id: Date.now(),
    title,
    description,
    url,
    createdAt: new Date().toISOString(),
  };

  // Add to links array and save to localStorage
  links.unshift(newLink);
  localStorage.setItem("links", JSON.stringify(links));

  // Clear inputs
  titleInput.value = "";
  descriptionInput.value = "";
  linkInput.value = "";

  showAlert("Link saved successfully!", "success");
  displayRecentLinks();
});

// Search functionality
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = prompt("Enter title to search:");

  if (!searchTerm) return;

  const foundLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (foundLinks.length === 0) {
    showAlert("No links found with that title!", "error");
  } else {
    displayLinksPopup(foundLinks, `Search Results for "${searchTerm}"`);
  }
});

// Display links in a popup
function displayLinksPopup(linksToShow, title) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.backgroundColor = "rgba(0,0,0,0.7)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "1000";

  popup.innerHTML = `
    <div class="popup-content glass-panel" style="padding: 2rem; max-width: 90%; width: 100%; max-width: 700px; max-height: 80vh; overflow-y: auto;">
      <div class="popup-header" style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; align-items: center;">
        <h2 class="holographic-header" style="font-size: 1.5rem;">${title}</h2>
        <span class="close-btn" style="cursor: pointer; font-size: 1.5rem; color: var(--text-secondary);">&times;</span>
      </div>
      <div class="links-container" style="display: grid; gap: 1rem;">
        ${linksToShow.map(link => `
          <div class="link-card" style="border-left: 3px solid var(--neon-purple);">
            <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem; color: var(--neon-blue);">${link.title}</h3>
            ${link.description ? `<p style="margin-bottom: 0.5rem; color: var(--text-secondary);">${link.description}</p>` : ''}
            <a href="${link.url}" target="_blank" style="display: block; margin-bottom: 0.5rem; color: var(--neon-blue); word-break: break-all;">${link.url}</a>
            <button class="neon-btn delete-btn" data-id="${link.id}" style="background: var(--danger); border-color: var(--danger); margin-top: 0.5rem;">
              <i class="fas fa-trash" style="margin-right: 8px;"></i>
              Delete
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // Close popup when clicking X
  popup.querySelector(".close-btn").addEventListener("click", () => {
    popup.remove();
  });

  // Close popup when clicking outside
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  // Delete button functionality
  popup.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      links = links.filter((link) => link.id !== id);
      localStorage.setItem("links", JSON.stringify(links));
      e.target.closest(".link-card").remove();
      displayRecentLinks();
    });
  });
}

// Display recent links
function displayRecentLinks() {
  const recentLinks = links.slice(0, 3);

  if (recentLinks.length === 0) {
    recentLinksContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
        <i class="fas fa-link" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
        <p>No links saved yet</p>
      </div>
    `;
  } else {
    recentLinksContainer.innerHTML = `
      <div style="display: grid; gap: 1.5rem;">
        ${recentLinks.map(link => `
          <div class="link-card">
            <a href="${link.url}" target="_blank" style="text-decoration: none; color: inherit;">
              <h3 style="margin-bottom: 0.5rem; color: var(--neon-blue);">${link.title}</h3>
            </a>
            ${link.description ? `<p style="margin-bottom: 0.5rem; color: var(--text-secondary);">${link.description}</p>` : ''}
            <a href="${link.url}" target="_blank" style="display: block; margin-bottom: 0.5rem; color: var(--neon-blue); word-break: break-all;">${link.url}</a>
          </div>
        `).join('')}
      </div>
      ${links.length > 3 ? `
        <button id="seeMoreBtn" class="neon-btn" style="margin: 1.5rem auto 0; display: block;">
          <i class="fas fa-ellipsis-h" style="margin-right: 8px;"></i>
          See All Links
        </button>
      ` : ''}
    `;

    if (links.length > 3) {
      document.getElementById("seeMoreBtn").addEventListener("click", () => {
        displayLinksPopup(links, "All Saved Links");
      });
    }
  }
}

// Show alert notification
function showAlert(message, type) {
  const alert = document.createElement("div");
  alert.style.position = "fixed";
  alert.style.top = "20px";
  alert.style.right = "20px";
  alert.style.padding = "12px 24px";
  alert.style.borderRadius = "8px";
  alert.style.color = "white";
  alert.style.zIndex = "1001";
  alert.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  alert.style.animation = "slideIn 0.3s ease-out";
  
  if (type === "error") {
    alert.style.background = "var(--danger)";
  } else {
    alert.style.background = "var(--success)";
  }
  
  alert.textContent = message;
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  displayRecentLinks();
});