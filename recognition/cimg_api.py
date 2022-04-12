from django.http import JsonResponse
from .file_service import FileService as FS
from .utility import Utility
import string, random
import os
import shutil

img_path="base/static/temp/images/"
def get_single_classification(request):
    img_toclass=request.FILES["imgtoclass"]
    extension=FS.get_extension(img_toclass.name)
    img_name=Utility.get_random_string()+"-"+str(random.randint(0,10000))
    img_name="".join(random.sample(img_name,len(img_name)))+"."+extension
    path=img_path+img_name
    FS.move_upload(img_toclass,path)
    FS.remove_file(path)

