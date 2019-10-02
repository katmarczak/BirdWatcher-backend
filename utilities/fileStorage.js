const multer = require('multer');
const mkdirp = require('mkdirp');

const baseFolder = 'uploads';

function createFileUploader(destinationFolderName, fileSizeLimit) {
    const diskStorage = multer.diskStorage({
        destination: function(request, file, callback) {
            mkdirp.sync(destinationFolderName);
            callback(null, destinationFolderName);
        },
        filename: function(request, file, callback) {
            callback(null, file.originalname);
        }
    });

    const uploader = multer({ 
        storage: diskStorage,
        limits: { fileSize: fileSizeLimit }
    });

    return uploader;
}

module.exports = createFileUploader;