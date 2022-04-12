from django.http import JsonResponse
from .file_service import FileService as FS
from .utility import Utility
import string, random
import os
import shutil
from .models import Student
import face_recognition
import pickle


try:
    with open("encodingface/faces.bin","rb") as f:
        #data_test = pickle.load(f)
        #print(data_test)
        pass
except:
    print("Opening")
    custom_face= {}
    with open("encodingface/faces.bin","wb+") as f:
        pickle.dump(custom_face, f)
img_path="recognition/static/images/students/"
def perform_add_student(request):
   
    name = str(request.POST["name"]).strip()
    lastname= str(request.POST["lastname"]).strip()
    registration = str(request.POST["registration"]).strip()

    img_toclass=request.FILES["imgtoclass"]
    extension=FS.get_extension(img_toclass.name)
    img_name=Utility.get_random_string()+"-"+str(random.randint(0,10000))
    img_name="".join(random.sample(img_name,len(img_name)))+"."+extension
    img_path_f=img_path+img_name
    print(img_path_f,img_toclass.name)
    test_up=FS.move_upload(img_toclass,img_path_f)
    print(test_up)
    student= Student()
    student.name =name
    student.lastname = lastname
    student.registrationNumber = registration
    student.real_img = img_name
    data= {"msg": "Echec d'enregistrement", "status":False}
    try:
        
        image = face_recognition.load_image_file(img_path_f)
        face_locations = face_recognition.face_locations(image)
        face_encoding = face_recognition.face_encodings(image)

        if (len(face_encoding) == 0):
            data["msg"] = "Please uplaod a face"
        else:
            face_encoding = face_encoding[0]
            student.save()
            print(face_encoding)
        
            faces = {}
            with open("encodingface/faces.bin","rb") as f:
                faces = pickle.load(f)

            faces[registration]= face_encoding
            with open("encodingface/faces.bin","wb") as f:
                pickle.dump(faces,f)
            
            data["status"]= True
    except:
        print("Nous sommes dans une erreur")
        FS.remove_file(img_path_f)
    data["students"]= Student.objects.all().order_by("-pk")
    data["students"]= [ {"registrationNumber":elt.registrationNumber,"name":elt.name,"lastname": elt.lastname,"real_img":elt.real_img} for elt in data["students"]]
    return JsonResponse(data)

def perform_find_match (request):
    img_toclass=request.FILES["imgtoclass"]
    extension=FS.get_extension(img_toclass.name)
    img_name=Utility.get_random_string()+"-"+str(random.randint(0,10000))
    img_name="".join(random.sample(img_name,len(img_name)))+"."+extension
    img_path_f=img_path+img_name
    print(img_path_f,img_toclass.name)
    test_up=FS.move_upload(img_toclass,img_path_f)
    unknown_image = face_recognition.load_image_file(img_path_f)
    data = {"students": []}
    unknown_encoding=  face_recognition.face_encodings(unknown_image)
    
    if (len(unknown_encoding) > 0):
        unknown_encoding= unknown_encoding[0]
        faces = {}
        with open("encodingface/faces.bin","rb") as f:
            faces = pickle.load(f)
        students_matchs =[]

        for elt in faces.keys():
            results = face_recognition.compare_faces([faces[elt]], unknown_encoding)
            if results[0] == True:
                students_matchs.append(elt)

        FS.remove_file(img_path_f)
        data["students"] = Student.objects.filter(registrationNumber__in = students_matchs)
        data["students"] = [ {"registrationNumber":elt.registrationNumber,"name":elt.name,"lastname": elt.lastname,"real_img":elt.real_img} for elt in data["students"]]
    return JsonResponse(data)

    