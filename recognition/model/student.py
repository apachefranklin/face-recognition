from tkinter.tix import Tree
from django.db import models

class Student(models.Model):
    name = models.TextField(max_length=50,null=False)
    lastname= models.TextField(max_length=50, null= True)
    registrationNumber = models.TextField(max_length=50, null=False, unique=True)
    img_encoding= models.TextField(max_length=50, null=False)

    real_img = models.TextField(max_length=50, null=False)

