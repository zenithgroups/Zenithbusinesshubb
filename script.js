// ✅ Typing Effect
const typingText = "Developed by Tharun";
const typingSpeed = 100;
let charIndex = 0;

function typeText() {
  if (charIndex < typingText.length) {
    document.getElementById("typingText").textContent += typingText[charIndex];
    charIndex++;
    setTimeout(typeText, typingSpeed);
  } else {
    setTimeout(() => {
      document.getElementById("typingContainer").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
    }, 500);
  }
}

// Start typing effect when page loads
document.addEventListener("DOMContentLoaded", typeText);

// ✅ API Keys
const NEWS_API_KEY = "5efc449ca97f4758928a32f0894c40fb";
const GNEWS_API_KEY = "eee40719d62e68f5a6d3b624856517c8";

// ✅ Load latest news on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchLatestNews();
});

// ✅ Fetch latest news globally
async function fetchLatestNews(useFallback = false) {
  const apiUrl = useFallback
    ? `https://gnews.io/api/v4/top-headlines?category=business&lang=en&token=${GNEWS_API_KEY}`
    : `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles, "latestNewsContainer");
    } else {
      if (!useFallback) {
        showNotification("⚠️ No latest news from NewsAPI. Trying GNews...");
        fetchLatestNews(true);
      } else {
        showNotification("❌ No latest business news found.");
      }
    }
  } catch (error) {
    console.error("Error fetching latest news:", error);
    if (!useFallback) {
      showNotification("⚠️ Error fetching NewsAPI. Trying GNews...");
      fetchLatestNews(true);
    } else {
      showNotification("❌ Error fetching from both APIs.");
    }
  }
}

// ✅ Function to display news
function displayNews(articles, containerId) {
  const newsContainer = document.getElementById(containerId);
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");
    newsItem.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.description || "No description available."}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    newsContainer.appendChild(newsItem);
  });
}

// ✅ Function to search news
function filterNews() {
  const query = document.getElementById("searchBox").value.trim();
  if (query !== "") {
    showNotification(`🔍 Searching for "${query}"...`);
    fetchNews(query);
  } else {
    showNotification("⚡️ Showing latest business news...");
    fetchLatestNews();
  }
}

// ✅ Fetch news based on query
async function fetchNews(query, useFallback = false) {
  if (!query) {
    return;
  }

  const apiUrl = useFallback
    ? `https://gnews.io/api/v4/search?q=${query}&lang=en&token=${GNEWS_API_KEY}`
    : `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles, "searchResults");
    } else {
      if (!useFallback) {
        showNotification("⚠️ No results from NewsAPI. Trying GNews...");
        fetchNews(query, true);
      } else {
        showNotification("❌ No results found.");
      }
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    if (!useFallback) {
      showNotification("⚠️ Error fetching NewsAPI. Trying GNews...");
      fetchNews(query, true);
    } else {
      showNotification("❌ Error fetching from both APIs.");
    }
  }
}

// ✅ Show notifications
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 5000);
}
