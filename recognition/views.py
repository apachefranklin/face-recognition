from django.shortcuts import render
from .models import Student
# Create your views here.

def index(request):
    data={"title":"FinderFaces"}
    return render(request,"index.html",data)

def demo(request):
    data={"title":"FinderFaces demo","demo":"demo"}
    return render(request,"demo.html",data)

def upload_zip(request):
    data={"title":"FinderFaces zip"}
    return render(request,"upload_zip.html",data)

def upload_student_face(request):
    data = {"students": Student.objects.all().order_by("name")}
    
    return render(request,"upload_student.html",data)