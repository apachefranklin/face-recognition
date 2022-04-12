import os
from zipfile import ZipFile

class FileService:
    def __init__(self, *args, **kwargs):
        pass
    @classmethod
    def validate_file_size(cls,file,max_size=1024*1024*16):
        size=file.size
        if size>max_size:
            return False
        return True

    @classmethod
    def move_upload(cls,file_request,save_path,max_size=1024*1024*3):
        if cls.validate_file_size(file_request,max_size):
            with open(save_path, 'wb+') as destination:
                print("Welll")
                for chunk in file_request.chunks():
                    destination.write(chunk)
            return True
        return False
    
    @classmethod
    def zip_folder(cls,folder,zip_path):
        with ZipFile(zip_path, 'w') as zipObj:
            # Iterate over all the files in directory
            for folderName, subfolders, filenames in os.walk(folder):
                for filename in filenames:
                    #create complete filepath of file in directory
                    filePath = os.path.join(folderName, filename)
                    # Add file to zip
                    #folderName=folderName.split("/")
                    #folderName=folderName[4:]
                    #folderName="/".join(folderName)
                    filePath = os.path.join(folderName, filename)
                    # Add file to zip
                    zipObj.write(filePath)



    
    @classmethod
    def remove_file(cls,filepath):
        """delete file pass like argument"""
        status=True
        try:
            os.remove(filepath)
        except Exception as e:
            ##print(e)
            status=False
        
        return status
    @classmethod
    def get_extension(cls,file_name):
        split_t=file_name.split(".")
        return split_t[-1]
    
    @classmethod
    def unzip(cls,path_zip,path_to_unzip=""):
        with ZipFile(path_zip,"r") as fzip:
            if(path_to_unzip.strip()!=""):
                fzip.extractall(path_to_unzip)
            else:
                fzip.extractall()
    @classmethod
    def get_all_file_paths(cls,folder_path):
        file_paths=[]
        # crawling through directory and subdirectories 
        for root, directories, files in os.walk(folder_path): 
            for filename in files: 
                # join the two strings in order to form the full filepath. 
                filepath = os.path.join(root, filename) 
                file_paths.append(filepath)
        # returning all file paths 
        return file_paths  