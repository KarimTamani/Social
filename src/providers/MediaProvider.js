
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ReactNativeFile } from "apollo-upload-client";
export const mimeType =
{
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "mp4": "video/mp4",
    "m4a": "audio/mp4"
}

export const IMAGE = 0;
export const AUDIO = 1;
export const VIDEO = 2;



export const getFileMimeType = (file) => {

    return mimeType[getFileExtension(file)];
}

export const getFileExtension = (file) => {

    return file.split(".").pop();

}

export const getFileName = (file) => {

    return file.split("/").pop();

}


export const getFileType = (file) => {
    const mimeType = getFileMimeType(file);
    if (mimeType.startsWith("image"))
        return IMAGE;
    else if (mimeType.startsWith("video"))
        return VIDEO;
    else if (mimeType.startsWith("audio"))
        return AUDIO;

}

export const createRNUploadableFile = async (file) => {

    var uri = file;

    const extension = getFileExtension(file);
    const mimeTye = getFileMimeType(file);


    if (!mimeTye)
        throw new Error("Not valid file type");



    if (mimeTye.startsWith("image")) {
        var compressedImage = await compreessImage(uri);
        if (!compressedImage)
            throw new Error("Cant compress");

        uri = compressedImage.uri;
    }
    const filename = getFileName(uri);


    return new ReactNativeFile({
        type: mimeTye,
        name: filename,
        uri: uri
    });

}


export const compreessImage = async (image) => {

    try {
        const manipResult = await manipulateAsync(
            image,
            [{ resize: { width: 512 } }],
            { format: 'jpeg' }
        );
        return manipResult;

    } catch (error) {
        return null;
    }

}