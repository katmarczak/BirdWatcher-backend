const multer = require('multer');
const fs = require('fs-extra');

const baseFolder = 'public';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
const imageFileFilter = function (request, file, callback) {
    if (allowedImageTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('MIME type not supported'), false);
    }
};

function createObservationPhotosUploader() {
    let photoStorage = multer.diskStorage({
        destination: function (request, file, callback) {
            let path = `${baseFolder}/images/user_photos/${request.user._id}/observations/${request.params.id}`;
            console.log(path);
            fs.ensureDirSync(path);
            callback(null, path);
        },
        filename: function (request, file, callback) {
            callback(null, `${file.originalname}`);
        }
    });

    let photosUploader = multer({
        storage: photoStorage,
        limits: {
            fieldSize: 10000000
        },
        filter: imageFileFilter
    });

    return photosUploader;
}

function createAvatarUploader() {
    let avatarsStorage = multer.diskStorage({
        destination: function (request, file, callback) {
            let path = `${baseFolder}/images/user_photos/${request.user._id}/avatar`;
            fs.emptyDir(path, error => {
                if (error) return console.error(error);
                callback(null, path);
            });
        },
        filename: function (request, file, callback) {
            callback(null, `${file.originalname}`);
        }
    });

    let avatarUploader = multer({
        storage: avatarsStorage,
        limits: { fileSize: 1e6 },
        fileFilter: imageFileFilter
    });

    return avatarUploader.single('avatar');
}

function getUserAvatarPath(userId) {
    return fs.readdir(`${baseFolder}/images/user_photos/${userId}/avatar`, { withFileTypes: true })
        .then((filenames) => {
            if (filenames[0]) {
                const filename = filenames[0];
                return `images/user_photos/${userId}/avatar/${filename}`;
            } else {
                return undefined;
            }
        })
        .catch((error) => console.log(error));
}

function getObservationPhotoPath(observationId, ownerId) {
    return fs.readdir(`${baseFolder}/images/user_photos/${ownerId}/observations/${observationId}`, { withFileTypes: true })
        .then((filenames) => {
            if (filenames[0]) {
                const filename = filenames[0];
                return `images/user_photos/${ownerId}//observations/${observationId}/${filename}`;
            } else {
                return undefined;
            }
        })
        .catch((error) => console.log(error));
}

const AvatarUploader = createAvatarUploader();
const ObservationPhotosUploader = createObservationPhotosUploader();

module.exports.AvatarUploader = AvatarUploader;
module.exports.PhotosUploader = ObservationPhotosUploader;
module.exports.getUserAvatarPath = getUserAvatarPath;
module.exports.getObservationPhotoPath = getObservationPhotoPath;