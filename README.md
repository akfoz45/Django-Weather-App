# 🌤️ Django Weather App

A modern, full-featured weather application built with Django. It provides real-time weather data, 5-day forecasts, geolocation support, and interactive visualizations, wrapped in a sleek "Glassmorphism" Dark Mode UI.

## ✨ Features

* **📍 Geolocation Support:** Automatically detects your location to show current weather.
* **🔍 City Autocomplete:** Smart search bar with autocomplete suggestions (powered by Open-Meteo API).
* **📊 Interactive Charts:** Visualizes temperature trends using Chart.js on the detail page.
* **🗺️ Map Integration:** Displays added cities on an interactive map using Leaflet.js.
* **🌑 Modern UI:** Custom CSS with Dark Mode, Glassmorphism effects, and responsive Grid layout.
* **⚡ Real-time Data:** Fetches live data including Humidity, Wind Speed, and "Feels Like" temperature from OpenWeatherMap.
* **💾 Database Caching:** Caches weather data in SQLite to minimize API calls (updates hourly).
* **🗑️ Smart Deletion:** SweetAlert2 integration for stylish confirmation popups before deleting a city.

## 🛠️ Tech Stack

* **Backend:** Python, Django 5.x
* **Frontend:** HTML5, CSS3 (Custom), JavaScript
* **APIs:** OpenWeatherMap API, Open-Meteo Geocoding API
* **Libraries:** * `Chart.js` (Data Visualization)
    * `Leaflet.js` (Maps)
    * `SweetAlert2` (UI Popups)
    * `Requests` (HTTP Requests)

## 🚀 Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/akfoz45/Django-Weather-App.git
cd DjangoWeatherApp
```
### 2. Create a Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```
### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
### 4. Configure Environment Variables

Create a .env file in the root directory and add your OpenWeatherMap API key:
```bash
WEATHER_API=your_openweathermap_api_key_here
```
### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
### 6. Run the Server
```bash
python manage.py runserver
```
Open your browser and visit: http://127.0.0.1:8000/

## 📂 Project Structure
```text
WeatherApp/
├── weather/              # Main App Directory
│   ├── templates/        # HTML Files
│   ├── static/           # CSS, JS, Images
│   ├── views.py          # Backend Logic
│   └── models.py         # Database Models
├── weather_app_project/  # Project Settings
├── db.sqlite3            # Database
├── manage.py
└── requirements.txt
```

## 📸 Screenshots

| Dashboard | Detail 1 | Detail 2 |
|:---:|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Detail](screenshots/detail1.png) |  ![Detail](screenshots/detail2.png) |