document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const questionInput = document.getElementById("questionInput");
  const aiError = document.getElementById("aiError");
  const aiAdvice = document.getElementById("aiAdvice");
  const loading = document.getElementById("loading");
  const weatherCard = document.getElementById("weatherResult");
  const themeToggle = document.getElementById("themeToggle");

  let latestWeatherData = null;

  // Country backgrounds
  const countryBackgrounds = {
    AU: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3lkbmV5fGVufDB8fDB8fHww?auto=format&fit=crop&w=1500&q=80",
    NP: "https://www.andbeyond.com/wp-content/uploads/sites/5/nepal-village.jpg?auto=format&fit=crop&w=1500&q=80",
    US: "https://wallpapersok.com/images/hd/new-york-hd-harbor-and-skyscrapers-5lcoe5nyg04r0tl7.jpg?auto=format&fit=crop&w=1500&q=80",
    FR: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1500&q=80",
    JP: "https://images3.alphacoders.com/979/97969.jpg?auto=format&fit=crop&w=1500&q=80",
    IN: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWF8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop&w=1500&q=80",
    GB: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9uZG9ufGVufDB8fDB8fHww?auto=format&fit=crop&w=1500&q=80",
  };

  // Load last city
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather();
  }

  // Dark mode toggle setup
  const darkPref = localStorage.getItem("darkMode");
  if (darkPref === "enabled") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "🌚 Toggle Light Mode";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      themeToggle.textContent = isDark ? "🌚 Toggle Light Mode" : "🌞 Toggle Dark Mode";
    });
  }

  // Location-based city detection
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`);
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "";
        if (city) {
          cityInput.value = city;
          getWeather();
        }
      } catch (err) {
        console.error("Geolocation error:", err);
      }
    });
  }

  // Weather fetcher
  async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    localStorage.setItem("lastCity", city);
    loading.style.display = "block";

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=670bf1ca8ae119a31433dc91fdbd8362&units=metric`);
      const data = await res.json();

      if (!res.ok || !data.main) throw new Error("City not found");

      latestWeatherData = data;

      const countryCode = data.sys.country;
      const bgUrl = countryBackgrounds[countryCode];
      if (bgUrl) {
        document.body.style.backgroundImage = `url('${bgUrl}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.transition = "background-image 0.5s ease-in-out";
      } else {
        document.body.style.backgroundImage = "none";
        document.body.style.background = document.body.classList.contains("dark-mode")
          ? "linear-gradient(to right, #1a1a1a, #121212)"
          : "linear-gradient(to right, #e0f7fa, #fff)";
      }

      fetchNews(countryCode.toLowerCase());

      document.getElementById("cityName").textContent = data.name;
      document.getElementById("temp").textContent = data.main.temp.toFixed(1);
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("humidity").textContent = data.main.humidity;
      document.getElementById("wind").textContent = data.wind.speed;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      aiAdvice.textContent = getFallbackAdvice(data);
      weatherCard.classList.remove("hidden");

      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      document.getElementById("sunrise").textContent = sunrise;
      document.getElementById("sunset").textContent = sunset;
    } catch (err) {
      alert("❌ Unable to fetch weather.");
      console.error(err);
    } finally {
      loading.style.display = "none";
    }
  }

  // AI fallback or mock
  function getFallbackAdvice(data) {
    const { temp, humidity } = data.main;
    const wind = data.wind.speed;

    if (humidity > 80) return "💧 Might feel muggy today!";
    if (wind > 10) return "💨 Breezy day — wear a jacket!";
    if (temp > 30) return "🔥 Stay hydrated, it's hot!";
    if (temp < 10) return "🧊 Dress warmly, it's chilly!";
    return `It's a decent day. ${data.weather[0].description}, ${temp.toFixed(1)}°C, ${humidity}% humidity.`;
  }

  // Ask AI (mock)
  async function askAI() {
    const question = questionInput.value.trim();
    if (!question || !cityInput.value.trim() || !latestWeatherData) return;

    aiError.textContent = "";
    aiAdvice.textContent = "";
    loading.style.display = "block";

    try {
      const answer = getMockAIResponse(question, latestWeatherData);
      aiAdvice.textContent = answer;
    } catch (err) {
      aiError.textContent = "⚠️ AI error occurred.";
      console.error(err);
    } finally {
      loading.style.display = "none";
    }
  }

  // Mock response logic
  function getMockAIResponse(q, data) {
    const temp = data.main.temp;
    if (q.toLowerCase().includes("umbrella")) {
      return data.weather[0].main.toLowerCase().includes("rain")
        ? "☔ Yes, bring an umbrella."
        : "🌤️ No umbrella needed today.";
    }
    return `🤖 The weather is ${data.weather[0].description} with ${temp.toFixed(1)}°C.`;
  }

  // News Fetch
  async function fetchNews(countryCode) {
    const apiKey = "pub_cda539826f694c2aaa07620fef3efc1d";
    try {
      const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&country=${countryCode}&language=en&category=top`);
      const data = await res.json();

      const oldBox = document.getElementById("newsBox");
      if (oldBox) oldBox.remove();

      const newsBox = document.createElement("div");
      newsBox.className = "card";
      newsBox.id = "newsBox";
      newsBox.innerHTML = `<h3>📰 Top News in ${countryCode.toUpperCase()}</h3>`;

      if (data.results && data.results.length > 0) {
        data.results.slice(0, 3).forEach(article => {
          newsBox.innerHTML += `<p><a href="${article.link}" target="_blank">${article.title}</a></p>`;
        });
      } else {
        newsBox.innerHTML += "<p>No news found.</p>";
      }

      document.querySelector(".container").appendChild(newsBox);
    } catch (err) {
      console.error("News fetch error:", err);
    }
  }

  // Expose for buttons
  window.getWeather = getWeather;
  window.askAI = askAI;
});
