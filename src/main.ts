import { bangs } from "./bang";
import "./global.css";

function renderMainPage() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  app.innerHTML = `
    <div class="main-bg">
      <button id="settings-link" class="settings-button-top" title="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
      <button id="browse-bangs-link" class="browse-bangs-button-top" title="Browse all bangs">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
      <div class="search-container">
        <header class="search-header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h1 class="title">Unduck</h1>
          <p class="tagline">Search with bangs</p>
        </header>
        <div class="search-box-container">
          <div class="search-input-group">
            <input id="main-search" type="text" placeholder="!g, !yt, !w..." class="search-input" autofocus />
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <div id="search-preview" class="search-preview"></div>
        </div>
      </div>
      <div class="toast" id="toast" style="display:none"></div>
      <footer class="footer">
        <span>Made by <a href="https://github.com/t3dotgg/unduck" target="_blank">t3dotgg</a> / <a href="https://github.com/thomasboom/unduck" target="_blank">thomasboom</a></span>
      </footer>
    </div>
  `;

  const searchInput = app.querySelector<HTMLInputElement>("#main-search")!;
  const settingsLink = app.querySelector<HTMLButtonElement>("#settings-link")!;
  const browseBangsLink = app.querySelector<HTMLButtonElement>("#browse-bangs-link")!;

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/?q=${encodeURIComponent(query)}`;
    }
  }

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  settingsLink.addEventListener("click", () => {
    showSettingsModal();
  });

  browseBangsLink.addEventListener("click", () => {
    renderBangsOverview();
  });

  let suggestionsContainer: HTMLDivElement | null = null;
  let selectedSuggestionIndex = -1;

  function createSuggestionsContainer() {
    if (suggestionsContainer) return suggestionsContainer;

    suggestionsContainer = document.createElement("div");
    suggestionsContainer.className = "search-suggestions";

    return suggestionsContainer;
  }

  function showSuggestions(suggestions: typeof bangs) {
    if (suggestions.length === 0) {
      hideSuggestions();
      return;
    }

    const container = createSuggestionsContainer();
    container.innerHTML = "";

    suggestions.slice(0, 6).forEach((bang, index) => {
      const suggestion = document.createElement("div");
      suggestion.className = "search-suggestion";

      suggestion.innerHTML = `
        <span class="search-suggestion-trigger">!${bang.t}</span>
        <div>
          <div class="search-suggestion-name">${bang.s}</div>
          ${bang.d ? `<div class="search-suggestion-desc">${bang.d}</div>` : ''}
        </div>
      `;

      suggestion.addEventListener("mouseenter", () => {
        selectedSuggestionIndex = index;
        updateSuggestionSelection();
      });

      suggestion.addEventListener("mouseleave", () => {
        if (selectedSuggestionIndex === index) {
          selectedSuggestionIndex = -1;
          updateSuggestionSelection();
        }
      });

      suggestion.addEventListener("click", () => {
        selectSuggestion(bang);
      });

      container.appendChild(suggestion);
    });

    container.style.display = "block";
    selectedSuggestionIndex = -1;
    updateSuggestionSelection();
  }

  function updateSuggestionSelection() {
    if (!suggestionsContainer) return;

    const suggestions = suggestionsContainer.querySelectorAll(".search-suggestion");
    suggestions.forEach((suggestion, index) => {
      if (index === selectedSuggestionIndex) {
        suggestion.classList.add("selected");
      } else {
        suggestion.classList.remove("selected");
      }
    });
  }

  function hideSuggestions() {
    if (suggestionsContainer) {
      suggestionsContainer.style.display = "none";
    }
    selectedSuggestionIndex = -1;
  }

  function selectSuggestion(bang: typeof bangs[0]) {
    const query = `!${bang.t} `;
    searchInput.value = query;
    searchInput.focus();
    hideSuggestions();
    setTimeout(() => {
      const event = new KeyboardEvent("keypress", { key: "Enter" });
      searchInput.dispatchEvent(event);
    }, 10);
  }

  function getSuggestions(searchTerm: string): typeof bangs {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = searchTerm.toLowerCase();

    if (normalizedSearch.startsWith("!")) {
      const bangTrigger = normalizedSearch.slice(1);

      const exactMatch = bangs.filter(b => b.t.toLowerCase() === bangTrigger);
      const partialMatches = bangs.filter(b =>
        b.t.toLowerCase().includes(bangTrigger) &&
        b.t.toLowerCase() !== bangTrigger
      );

      return [...exactMatch, ...partialMatches];
    }

    if (normalizedSearch.length >= 2) {
      const triggerMatches = bangs.filter(b =>
        b.t.toLowerCase().includes(normalizedSearch)
      );

      const nameMatches = bangs.filter(b =>
        b.s.toLowerCase().includes(normalizedSearch) &&
        !triggerMatches.includes(b)
      );

      return [...triggerMatches, ...nameMatches].slice(0, 6);
    }

    return [];
  }

  function handleSearchInput() {
    const query = searchInput.value;
    const suggestions = getSuggestions(query);

    if (suggestions.length > 0) {
      showSuggestions(suggestions);
    } else {
      hideSuggestions();
    }

    updateSearchPreview();
  }

  function updateSearchPreview() {
    const previewEl = app.querySelector<HTMLDivElement>("#search-preview");
    if (!previewEl) return;

    const query = searchInput.value.trim();
    if (!query) {
      previewEl.classList.remove("visible");
      return;
    }

    const bangMatch = query.match(/!(\S+)/i);
    const bangCandidate = bangMatch?.[1]?.toLowerCase();

    if (bangCandidate) {
      const bang = bangs.find((b) => b.t.toLowerCase() === bangCandidate);
      const searchTerm = query.replace(/!\S+\s*/i, "").trim();

      if (bang) {
        if (searchTerm) {
          previewEl.innerHTML = `Search <span class="search-preview-query">${escapeHtml(searchTerm)}</span> on <span class="search-preview-bang">${escapeHtml(bang.s)}</span>`;
          previewEl.classList.add("visible");
        } else {
          previewEl.innerHTML = `Search <span class="search-preview-query placeholder">something</span> on <span class="search-preview-bang">${escapeHtml(bang.s)}</span>`;
          previewEl.classList.add("visible");
        }
      } else {
        previewEl.classList.remove("visible");
      }
    } else {
      previewEl.classList.remove("visible");
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  searchInput.addEventListener("input", handleSearchInput);

  searchInput.addEventListener("keydown", (e) => {
    if (!suggestionsContainer || suggestionsContainer.style.display === "none") {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const suggestions = getSuggestions(searchInput.value);
        if (suggestions.length > 0) {
          showSuggestions(suggestions);
          selectedSuggestionIndex = e.key === "ArrowDown" ? 0 : suggestions.length - 1;
          updateSuggestionSelection();
          e.preventDefault();
        }
      }
      return;
    }

    const suggestions = suggestionsContainer.querySelectorAll(".search-suggestion");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
        updateSuggestionSelection();
        break;
      case "ArrowUp":
        e.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
        updateSuggestionSelection();
        break;
      case "Enter":
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          e.preventDefault();
          const selectedBang = getSuggestions(searchInput.value)[selectedSuggestionIndex];
          if (selectedBang) {
            selectSuggestion(selectedBang);
          }
        }
        break;
      case "Escape":
        hideSuggestions();
        break;
    }
  });

  document.addEventListener("click", (e) => {
    if (suggestionsContainer &&
        !suggestionsContainer.contains(e.target as Node) &&
        e.target !== searchInput) {
      hideSuggestions();
    }
  });

  function positionSuggestionsContainer() {
    if (!suggestionsContainer) return;

    const searchBoxContainer = searchInput.closest(".search-box-container") as HTMLElement;
    if (searchBoxContainer) {
      searchBoxContainer.style.position = "relative";
      searchBoxContainer.appendChild(suggestionsContainer);
    }
  }

  setTimeout(positionSuggestionsContainer, 0);
}

function renderBangsOverview() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  app.innerHTML = `
    <div class="bangs-overview-bg">
      <button id="back-link" class="back-button" title="Back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="bangs-overview-container">
        <header class="bangs-overview-header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h1 class="title">All Bangs</h1>
          <p class="tagline">${bangs.length} bangs available</p>
        </header>
        <div class="bangs-overview-content">
          <div class="bangs-search-container">
            <input id="bangs-search" type="text" placeholder="Search bangs..." class="bangs-search-input" />
          </div>
          <div class="bangs-count" id="bangs-count">Showing all ${bangs.length} bangs</div>
          <div id="bangs-grid" class="bangs-grid"></div>
        </div>
      </div>
    </div>
  `;

  const backLink = app.querySelector<HTMLButtonElement>("#back-link")!;
  const bangsSearch = app.querySelector<HTMLInputElement>("#bangs-search")!;
  const bangsGrid = app.querySelector<HTMLDivElement>("#bangs-grid")!;
  const bangsCount = app.querySelector<HTMLDivElement>("#bangs-count")!;

  backLink.addEventListener("click", () => {
    renderMainPage();
  });

  function renderBangs(bangsToRender: typeof bangs) {
    bangsGrid.innerHTML = bangsToRender.map(bang => {
      const category = (bang.sc ?? bang.c) ?? "";
      return `
      <div class="bang-card">
        <div class="bang-card-header">
          <span class="bang-trigger">!${bang.t}</span>
          <span class="bang-category">${category}</span>
        </div>
        <div class="bang-name">${bang.s}</div>
        <div class="bang-domain">${bang.d}</div>
      </div>
    `}).join("");
  }

  function filterBangs(searchTerm: string): typeof bangs {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    if (!normalizedSearch) return bangs;

    return bangs.filter(bang => {
      const category = (bang.sc ?? bang.c) ?? "";
      return bang.t.toLowerCase().includes(normalizedSearch) ||
        bang.s.toLowerCase().includes(normalizedSearch) ||
        category.toLowerCase().includes(normalizedSearch);
    });
  }

  function updateBangsDisplay() {
    const searchTerm = bangsSearch.value;
    const filteredBangs = filterBangs(searchTerm);
    
    if (filteredBangs.length === 0) {
      bangsCount.textContent = `No bangs found for "${searchTerm}"`;
    } else if (searchTerm.trim()) {
      bangsCount.textContent = `Found ${filteredBangs.length} bang${filteredBangs.length === 1 ? '' : 's'} for "${searchTerm}"`;
    } else {
      bangsCount.textContent = `Showing all ${filteredBangs.length} bangs`;
    }

    renderBangs(filteredBangs.slice(0, 500));
  }

  bangsSearch.addEventListener("input", updateBangsDisplay);

  bangsSearch.focus();
  updateBangsDisplay();
}

function showSettingsModal() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  const overlay = document.createElement("div");
  overlay.className = "settings-modal-overlay";
  overlay.innerHTML = `
    <div class="settings-modal">
      <div class="settings-modal-header">
          <div class="settings-modal-title">Settings</div>
          <button class="settings-modal-close" id="close-settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="settings-modal-content">
        <div class="settings-modal-section">
          <label class="settings-modal-label">Default Bang</label>
          <input type="text" id="default-bang-input" class="settings-modal-input" placeholder="g, yt, w..." value="" />
          <small class="settings-modal-help">Bang shortcut without the ! symbol</small>
        </div>
        <div class="settings-modal-section">
          <label class="settings-modal-label">Search URL</label>
          <div class="settings-modal-url-row">
            <input type="text" class="settings-modal-url-input" id="output-url" value="https://unduck-me.vercel.app/?q=%s" readonly />
            <button class="settings-modal-copy" id="copy-url">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  app.appendChild(overlay);

  const closeButton = overlay.querySelector<HTMLButtonElement>("#close-settings")!;
  const copyButton = overlay.querySelector<HTMLButtonElement>("#copy-url")!;
  const urlInput = overlay.querySelector<HTMLInputElement>("#output-url")!;
  const defaultBangInput = overlay.querySelector<HTMLInputElement>("#default-bang-input")!;
  const toast = app.querySelector<HTMLDivElement>("#toast")!;

  function updateUrlInput() {
    const bangValue = defaultBangInput.value.trim().toLowerCase();
    let url = "https://unduck-me.vercel.app/?q=%s";
    if (bangValue && bangValue !== "g") {
      url += `&defaultBang=${bangValue}`;
    }
    urlInput.value = url;
  }

  defaultBangInput.addEventListener("input", updateUrlInput);

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyButton.classList.add("copied");
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied
    `;
    toast.textContent = "Copied!";
    toast.style.display = "block";
    toast.classList.add("show");
    setTimeout(() => {
      copyButton.classList.remove("copied");
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      `;
      toast.classList.remove("show");
      toast.style.display = "none";
    }, 2000);
  });

  function closeModal() {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => overlay.remove(), 200);
  }

  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && app.contains(overlay)) closeModal();
  });
}

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const urlInput = app.querySelector<HTMLInputElement>("#output-url")!;
  const bangPicker = app.querySelector<HTMLSelectElement>("#bang-picker")!;
  const bangSearch = app.querySelector<HTMLInputElement>("#bang-search")!;

  function updateUrlInput() {
    const selected = bangPicker.value;
    let url = "https://unduck-me.vercel.app/?q=%s";
    if (selected && selected !== "g") {
      url += `&defaultBang=${selected}`;
    }
    urlInput.value = url;
  }

  bangPicker.addEventListener("change", updateUrlInput);

  bangSearch.addEventListener("input", () => {
    const search = bangSearch.value.trim().toLowerCase();
    const normalizedSearch = search.startsWith("!") ? search.slice(1) : search;

    const exactMatch = bangs.filter(b => b.t.toLowerCase() === normalizedSearch);
    const partialMatches = bangs.filter(b =>
      (search === "" ||
        b.s.toLowerCase().includes(search) ||
        b.t.toLowerCase().includes(normalizedSearch)) &&
      b.t.toLowerCase() !== normalizedSearch
    );
    const filteredBangs = [...exactMatch, ...partialMatches];

    let optionsHtml = `<option value="">Google (!g, default)</option>`;
    if (filteredBangs.length > 0) {
      optionsHtml += filteredBangs
        .map(b => `<option value="${b.t}">${b.s} (!${b.t})</option>`)
        .join("");
    } else {
      optionsHtml += `<option value="" disabled style="color: #888; font-style: italic;">No bangs found</option>`;
    }
    bangPicker.innerHTML = optionsHtml;
    bangPicker.selectedIndex = 0;
    updateUrlInput();
  });

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyButton.classList.add("copied");
    const toast = app.querySelector<HTMLDivElement>("#toast")!;
    toast.textContent = "Copied!";
    toast.style.display = "block";
    toast.classList.add("show");
    setTimeout(() => {
      copyButton.classList.remove("copied");
      toast.classList.remove("show");
      toast.style.display = "none";
    }, 2000);
  });
}

function getMultipleBangUrls() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const bangMatches = query.match(/!(\S+)/gi);
  if (!bangMatches || bangMatches.length === 0) {
    return null;
  }

  const bangCandidates = bangMatches.map(match => match.slice(1).toLowerCase());

  const urlDefaultBang = url.searchParams.get("defaultBang")?.toLowerCase();
  const urlDefaultBangObj = urlDefaultBang ? bangs.find((b) => b.t === urlDefaultBang) : undefined;

  const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  const localStorageDefaultBangObj = bangs.find((b) => b.t === LS_DEFAULT_BANG);

  const cleanQuery = query.replace(/!\S+/gi, "").trim();

  if (cleanQuery === "") {
    const urls: string[] = [];

    bangCandidates.forEach(bangCandidate => {
      const selectedBang =
        bangs.find((b) => b.t === bangCandidate) ||
        urlDefaultBangObj ||
        localStorageDefaultBangObj;

      if (selectedBang) {
        urls.push(`https://${selectedBang.d}`);
      }
    });

    return urls.length > 0 ? urls : null;
  }

  const urls: string[] = [];

  bangCandidates.forEach(bangCandidate => {
    const selectedBang =
      bangs.find((b) => b.t === bangCandidate) ||
      urlDefaultBangObj ||
      localStorageDefaultBangObj;

    if (selectedBang) {
      const searchUrl = selectedBang.u.replace(
        "{{{s}}}",
        encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
      );
      urls.push(searchUrl);
    }
  });

  return urls.length > 0 ? urls : null;
}

function openMultipleTabs(urls: string[]) {
  if (urls.length > 0) {
    window.location.href = urls[0];
  }

  for (let i = 1; i < urls.length; i++) {
    setTimeout(() => {
      window.open(urls[i], '_blank');
    }, i * 100);
  }
}

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);
  const bangCandidate = match?.[1]?.toLowerCase();

  const urlDefaultBang = url.searchParams.get("defaultBang")?.toLowerCase();
  const urlDefaultBangObj = urlDefaultBang ? bangs.find((b) => b.t === urlDefaultBang) : undefined;

  const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
  const localStorageDefaultBangObj = bangs.find((b) => b.t === LS_DEFAULT_BANG);

  const selectedBang =
    bangs.find((b) => b.t === bangCandidate) ||
    urlDefaultBangObj ||
    localStorageDefaultBangObj;

  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";

  // Special case: if query starts with "!bang" or "!bangs", show bangs overview
  const bangMatch = query.match(/^!(bang|bangs)(?:\s+(.+))?$/i);
  if (bangMatch) {
    renderBangsOverview();
    // If there's a search term, pre-fill the search input
    const searchTerm = bangMatch[2];
    if (searchTerm) {
      setTimeout(() => {
        const bangsSearch = document.querySelector<HTMLInputElement>("#bangs-search");
        if (bangsSearch) {
          bangsSearch.value = searchTerm;
          bangsSearch.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
    return;
  }

  const multipleUrls = getMultipleBangUrls();
  if (multipleUrls && multipleUrls.length > 1) {
    openMultipleTabs(multipleUrls);
    return;
  }

  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

function init() {
  if (window.location.hash === "#settings") {
    showSettingsModal();
    return;
  }

  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim();

  if (query) {
    doRedirect();
  } else {
    renderMainPage();
  }
}

init();
