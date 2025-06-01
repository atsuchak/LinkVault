// DOM Elements
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const linkInput = document.getElementById("link");
const saveButton = document.querySelector("button");
const searchBtn = document.querySelector(".search a");

// Initialize links array from localStorage or create empty array
let links = JSON.parse(localStorage.getItem("links")) || [];

// Save link function with URL validation
saveButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  let url = linkInput.value.trim();

  if (!title || !url) {
    alert("Title and Link are required!");
    return;
  }

  // Validate URL format
  if (
    !url.match(
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[^\s]*)?(#[^\s]*)?$/
    )
  ) {
    alert("Please enter a valid URL (e.g., http://example.com or example.com)");
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

  alert("Link saved successfully!");
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
    alert("No links found with that title!");
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
  popup.style.backgroundColor = "rgba(0,0,0,0.5)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "1000";

  popup.innerHTML = `
            <div class="popup-content" style="background: white; padding: 2rem; border-radius: 10px; max-width: 90%; width: 100%; max-height: 80%; overflow: auto;">
                <div class="popup-header" style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h2 style="font-size: 1.8rem;">${title}</h2>
                    <span class="close-btn" style="cursor: pointer; font-size: 1.5rem;">&times;</span>
                </div>
                <div class="links-container" style="display: flex; flex-direction: column; align-items: center; gap: 0.6rem;">
                    ${linksToShow
                      .map(
                        (link) => `
                        <div class="link-item" style="display: flex;
                         flex-direction: column; border: 1px solid #ddd; padding: 1rem; border-radius: 5px; width: 100%; align-items: center;">
                            <h3 style="margin-bottom: 0.5rem; font-size: 2rem;">${
                              link.title
                            }</h3>
                            ${
                              link.description
                                ? `<p style="margin-bottom: 0.5rem; opacity: 0.7;">${link.description}</p>`
                                : ""
                            }
                            <a href="${
                              link.url
                            }" target="_blank" style="word-break: break-all; display: block; margin-bottom: 0.5rem;">${
                          link.url
                        }</a>
                            <button class="delete-btn" data-id="${
                              link.id
                            }" style="padding: 0.5rem 1rem; font-size: 1.2rem; background: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
                        </div>
                    `
                      )
                      .join("")}
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
      e.target.closest(".link-item").remove();
      displayRecentLinks();
    });
  });
}

// Display recent 3 links on homepage
function displayRecentLinks() {
  let recentLinksContainer = document.querySelector(".recent-links");

  // Create container if it doesn't exist
  if (!recentLinksContainer) {
    const container = document.querySelector(".container");
    recentLinksContainer = document.createElement("div");
    recentLinksContainer.className = "recent-links";
    recentLinksContainer.style.width = "80%";
    recentLinksContainer.style.marginTop = "2rem";
    container.appendChild(recentLinksContainer);
  }

  const recentLinks = links.slice(0, 3);

  if (recentLinks.length === 0) {
    recentLinksContainer.innerHTML = "<p>No links saved yet.</p>";
  } else {
    recentLinksContainer.innerHTML = `
                <h2 style="margin-bottom: 1rem; text-align: center;">Recent Links</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${recentLinks
                      .map(
                        (link) => `
                        <div class="recent-link-item" style="border: 1px solid #ddd; padding: 1.5rem; border-radius: 10px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <a href="${
                              link.url
                            }" target="_blank" style="text-decoration: none; color: inherit;">
                                <h3 style="margin-bottom: 0.5rem; text-align: center; font-size: 1.3rem;">${
                                  link.title
                                }</h3>
                            </a>
                            ${
                              link.description
                                ? `<p style="margin-bottom: 0.5rem; opacity: 0.7; text-align: center;">${link.description}</p>`
                                : ""
                            }
                            <a href="${
                              link.url
                            }" target="_blank" style="word-break: break-all; display: block; text-align: center; color: #0066cc;">${
                          link.url
                        }</a>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                ${
                  links.length > 3
                    ? '<button id="seeMoreBtn" style="margin-top: 1rem; text-align: center; width: 60%; padding: 0.7rem; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">See More</button>'
                    : ""
                }
            `;

    if (links.length > 3) {
      document.getElementById("seeMoreBtn").addEventListener("click", () => {
        displayLinksPopup(links, "All Saved Links");
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayRecentLinks();
});
