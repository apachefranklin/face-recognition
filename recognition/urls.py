from django.urls import path
from . import views
from . import cimg_api, student_api
urlpatterns = [
    # path("",views.index,name="home"),
    # 
    # path("perform/single/classification",cimg_api.get_single_classification,name="demoperform"),
    # path("uploadzip/",views.upload_zip,name="uploadzip"),
    path("", views.upload_student_face,name="student"),
    path("demo",views.demo,name="demo"),
    path("", views.upload_student_face,name="home"),
    path("paneladmin/performaddstudent",student_api.perform_add_student,name="studentperform"),
    path("paneladmin/performmatching", student_api.perform_find_match,name="performmatching")
]
