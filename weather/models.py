from django.db import models

class City(models.Model):
    name = models.CharField(max_length=25)
    temperature = models.FloatField(null=True, blank=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    icon = models.CharField(max_length=20, null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name