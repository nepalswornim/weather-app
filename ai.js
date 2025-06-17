function getMockAIResponse(question, weatherData) {
  if (!weatherData) return "🤖 Sorry, I don’t have any weather data yet.";

  const q = question.toLowerCase();
  const desc = weatherData.weather[0].description.toLowerCase();
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const wind = weatherData.wind.speed;

  // Define logic for each keyword type
  if (q.includes("rain")) {
    return desc.includes("rain") || desc.includes("drizzle")
      ? "🌧️ Looks rainy. Bring an umbrella!"
      : "☀️ No rain expected at the moment.";
  }

  if (q.includes("snow")) {
    return desc.includes("snow")
      ? "❄️ It's snowing or expected to snow. Stay warm!"
      : "☃️ No snow in the forecast.";
  }

  if (q.includes("hail")) {
    return desc.includes("hail")
      ? "🌨️ Hail is possible. Watch out for falling ice!"
      : "🌤️ No hail detected in the forecast.";
  }

  if (q.includes("hot") || q.includes("cold") || q.includes("temperature")) {
    if (temp > 30) return "🔥 It's really hot today. Stay cool!";
    if (temp < 10) return "🧊 It's freezing cold. Bundle up!";
    return `🌤️ The temperature is mild around ${temp.toFixed(1)}°C.`;
  }

  if (q.includes("humid") || q.includes("humidity")) {
    return humidity > 70
      ? "💦 It's quite humid today."
      : "🌬️ The air doesn't feel too humid.";
  }

  if (q.includes("wind") || q.includes("windy")) {
    return wind > 15
      ? "💨 It's very windy. Hold onto your hat!"
      : "🍃 Just a gentle breeze out there.";
  }

  // Fallback if none of the weather keywords are matched
  return "🤖 Your question doesn't seem related to weather. Try asking about rain, snow, temperature, wind, etc.";
}
