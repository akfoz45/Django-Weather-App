from django.shortcuts import render, redirect, get_object_or_404
import requests
from .models import City
from django.conf import settings
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta, datetime


def index(request):
    api_key = settings.WEATHER_API
    
    if request.method == 'GET' and 'lat' in request.GET and 'lon' in request.GET:
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')

        geo_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={api_key}"

        try:
            response = requests.get(geo_url).json()
            if response.get('cod') == 200:
                city_name = response['name']

                if not City.objects.filter(name=city_name).exists():
                    City.objects.create(
                            name=city_name,
                            temperature=response["main"]["temp"],
                            description=response["weather"][0]["description"],
                            icon=response['weather'][0]['icon'],
                            last_updated=timezone.now(),
                            lat=lat,
                            lon=lon,
                            humidity=response['main']['humidity'],
                            wind_speed=response['wind']['speed'],
                            feels_like=response['main']['feels_like'],
                        )
                    messages.success(request, f"Konumunuz ({city_name}) başarıyla eklendi.")
                else:
                    messages.info(request, f"{city_name} zaten listenizde mevcut.")
                
                return redirect('index')

        except requests.exceptions.RequestException:
            messages.error(request, "Konum alınırken bağlantı hatası oluştu.")

    if request.method == 'POST':
        city_name = request.POST.get("name")
        if city_name:
            city_name_formatted = city_name.title()

            if City.objects.filter(name=city_name_formatted).exists():
                messages.warning(request, f"{city_name_formatted} zaten listenizde ekli!")
            else:
                check_url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name_formatted}&units=metric&appid={api_key}"
                try:
                    response = requests.get(check_url).json()
                    if response.get('cod') == 200:
                        City.objects.create(
                            name=city_name_formatted,
                            temperature=response["main"]["temp"],
                            description=response["weather"][0]["description"],
                            icon=response['weather'][0]['icon'],
                            last_updated=timezone.now(),
                            lat=response['coord']['lat'],
                            lon=response['coord']['lon'],
                            humidity=response['main']['humidity'],
                            wind_speed=response['wind']['speed'],
                            feels_like=response['main']['feels_like'],
                        )   
                        messages.success(request, f"{city_name_formatted} başarıyla eklendi.")
                    else:
                        messages.warning(request, "Böyle bir şehir bulunamadı. Lütfen ismi kontrol edin.")
                except requests.exceptions.RequestException:
                    messages.error(request, "API bağlantı hatası.")

    cities = City.objects.all()

    weather_data = []

    for city in cities:
        needs_update = False
        error = False

        if city.last_updated is None or (timezone.now() - city.last_updated) > timedelta(hours=1):
            needs_update = True
        
        if needs_update:         
            try:
                url = f"http://api.openweathermap.org/data/2.5/weather?q={city.name}&units=metric&appid={api_key}"
                data = requests.get(url).json()

                if data.get('cod') == 200:
                    city.temperature = data['main']['temp']
                    city.description = data['weather'][0]['description']
                    city.icon = data['weather'][0]['icon']
                    city.last_updated = timezone.now()
                    city.humidity = data['main']['humidity']
                    city.wind_speed = data['wind']['speed']
                    city.feels_like = data['main']['feels_like']
                    city.save()
                else:
                    error = True
            except Exception as e:
                print(f"Hata: {e}")
                error = True

        city_weather = {
                    'city': city,
                    'temperature': city.temperature,
                    'description': city.description,
                    'icon': city.icon,
                    'weather_main':'default',
                    'error': error,
                }
        if city.icon:
            code = city.icon[:2]
            if code == '01':
                city_weather['weather_class'] = 'clear'
            elif code in ['02', '03', '04']:
                city_weather['weather_class'] = 'clouds'
            elif code in ['09', '10']:
                city_weather['weather_class'] = 'rain'
            elif code == '11':
                city_weather['weather_class'] = 'thunder'
            elif code == '13':
                city_weather['weather_class'] = 'snow'
            elif code == '50':
                city_weather['weather_class'] = 'mist'
            else:
                city_weather['weather_class'] = 'default'
        weather_data.append(city_weather)

    context = {
        'weather_data':weather_data,
    }

    return render(request, 'weather/base.html', context)

def delete_city(request, id):
    city = get_object_or_404(City, id=id)

    city.delete()

    return redirect('index')


def city_detail(request, id):
    city = get_object_or_404(City, id=id)
    api_key = settings.WEATHER_API
    
    url = "http://api.openweathermap.org/data/2.5/forecast"
    params = {
        'q': city.name,
        'units': 'metric',
        'appid': api_key,
        'lang': 'tr'
    }
    
    try:
        response = requests.get(url, params=params).json()

        if str(response.get('cod')) == "200":
            raw_data = response.get('list')
            
            daily_data = {}
            
            for item in raw_data:
                date_str = item['dt_txt'].split(' ')[0]
                
                if date_str not in daily_data:
                    daily_data[date_str] = []
                
                daily_data[date_str].append(item)
            
            daily_forecasts = []
            for date_str, items in daily_data.items():
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                daily_forecasts.append({
                    'date': date_str,      
                    'date_obj': date_obj,  
                    'items': items
                })
            daily_forecasts.sort(key=lambda x: x['date'])

            context = {
                'city': city,
                'daily_forecasts': daily_forecasts 
            }
            return render(request, 'weather/city_detail.html', context)
            
        else:
            hata_mesaji = response.get('message', 'Bilinmeyen hata')
            messages.warning(request, f"Hata oluştu: {hata_mesaji}")
            
    except requests.exceptions.RequestException:
        messages.error(request, "İnternet bağlantı hatası.")
        
    return redirect('index')