from django.shortcuts import render, redirect, get_object_or_404
import requests
from .models import City
from django.conf import settings
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta


def index(request):
    api_key = settings.WEATHER_API

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
                            last_updated=timezone.now()
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
                    'error': error,
                }
        weather_data.append(city_weather)

    context = {
        'weather_data':weather_data,
    }

    return render(request, 'weather/base.html', context)

def delete_city(request, id):
    city = get_object_or_404(City, id=id)

    city.delete()

    return redirect('index')
