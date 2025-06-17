const cityInput = document.getElementById("cityInput");
const questionInput = document.getElementById("questionInput");
const aiError = document.getElementById("aiError");
const aiAdvice = document.getElementById("aiAdvice");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherResult");

// Global variable to store weather data so the AI can use it
let latestWeatherData = null;

// Load the last searched city from localStorage, and fetch its weather
window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather();
  }
};

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  localStorage.setItem("lastCity", city);

  try {
    const apiKey = "670bf1ca8ae119a31433dc91fdbd8362"; // OpenWeatherMap API key
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    // Store the data globally for our AI functions
    latestWeatherData = data;

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temp").textContent = data.main.temp.toFixed(2);
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Use the fallback AI suggestion as an initial display
    aiAdvice.textContent = getFallbackAdvice(data);

    weatherCard.classList.remove("hidden");
  } catch (error) {
    alert("Failed to fetch weather data.");
  }
}

// Updated askAI() that uses the mock AI (defined in ai.js)
async function askAI() {
  const question = questionInput.value.trim();
  const city = cityInput.value.trim();
  if (!question || !city) return;
  
  aiError.textContent = "";
  loading.style.display = "block";
  aiAdvice.textContent = "";
  
  // Use our mock AI function from ai.js instead of fetching a paid API
  const answer = getMockAIResponse(question, latestWeatherData);
  aiAdvice.textContent = answer;
  loading.style.display = "none";
}

// A simple fallback suggestion for weather (used when weather data is present)
function getFallbackAdvice(data) {
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  if (humidity > 80) return "💧 Might feel muggy today!";
  if (wind > 10) return "💨 Breezy day — wear a jacket!";
  if (temp > 30) return "🔥 Stay hydrated, it's hot!";
  if (temp < 10) return "🧊 Dress warmly, it's chilly!";
  return `It's a decent day. Currently ${data.weather[0].description} with ${temp.toFixed(2)}°C and ${humidity}% humidity.`;
}

// Expose functions globally for HTML onclick handlers (if needed)
window.getWeather = getWeather;
window.askAI = askAI;
