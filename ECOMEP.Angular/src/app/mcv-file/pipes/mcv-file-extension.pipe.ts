import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'mcvFileExtension',
    standalone: true
})

export class McvFileExtensionPipe implements PipeTransform
{
    transform(fileName: string, length: number)
    {
        if (fileName)
        {
            //the below line gives us the extension of the filename
            const extension = fileName.slice(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

            //the below live gives the name of the file without any extension
            let newFileName: string = fileName.replace('.' + extension, '');

            //length of the string is less then equals to 13 return name of else slice till
            //13 letter and add clip with extension 
            if (fileName.length <= length)
            {
                return fileName;
            } else
            {
                newFileName = newFileName.slice(0, length);
                // console.log(newFileName + '...' + extension);
                return newFileName + '...' + extension;
            }
        } else
        {
            return fileName;
        }
    }
}