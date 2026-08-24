# 🌦️ Weather Aggregator

A modern full-stack weather application that provides weather information and forecasts based on user-selected locations.

The project combines a **React + Vite frontend** with a **FastAPI backend**, using weather and geolocation services to deliver weather information through a clean and responsive interface.

---

## 🚀 Features

- 🔍 Search weather by city or location
- 📍 Location and geocoding support
- 🌡️ Current weather information
- 📊 Hourly weather forecast
- 📅 Weather forecast data
- 🌧️ Weather conditions and precipitation information
- ⚡ Fast API-powered backend
- 📱 Responsive frontend interface
- 🔗 Frontend and backend separated into independent applications
- 🧩 REST API architecture

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- HTTPX

### APIs & Services

- Open-Meteo Weather API
- Geocoding services
- Pincode/location services

---

## 📁 Project Structure

```text
Weather-Aggregator/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── README.md