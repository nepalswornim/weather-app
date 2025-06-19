function getMockAIResponse(question, weatherData) {
  if (!weatherData) return "🤖 No data available.";
  const desc = weatherData.weather[0].description.toLowerCase();
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const wind = weatherData.wind.speed;
  const q = question.toLowerCase();

  if (q.includes("rain")) return desc.includes("rain") ? "🌧️ Definitely looks like rain." : "☀️ No rain expected!";
  if (q.includes("hot")) return temp > 30 ? "🔥 It's hot outside." : `🌤️ It's ${temp}°C.`;
  if (q.includes("cold")) return temp < 10 ? "❄️ Cold day!" : `🌡️ It's ${temp}°C.`;
  if (q.includes("humidity")) return humidity > 70 ? "💦 Very humid." : "🌬️ Not very humid.";
  if (q.includes("wind")) return wind > 15 ? "💨 Very windy!" : "🌬️ Mild breeze.";

  return `🤖 Conditions: ${desc}, ${temp}°C, ${humidity}% humidity.`;
}
