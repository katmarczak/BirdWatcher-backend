const multer = require('multer');
const fs = require('fs-extra');

const baseFolder = 'public';

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
        limits: { fileSize: 1e6 }
    });

    return avatarUploader;
}

function getUserAvatarPath(userId, callback) {
    fs.readdir(`${baseFolder}/images/user_photos/${userId}/avatar`, { withFileTypes: true },
        function(error, filenames) {
            if(error) {
                console.log(error);
                return callback(undefined);
            }           
            if (filenames[0]) {
                let filename = filenames[0];
                return callback(`images/user_photos/${userId}/avatar/${filename}`);
            } else {
                return callback(undefined);
            }
        });
}

const AvatarUploader = createAvatarUploader();

module.exports.AvatarUploader = AvatarUploader;
module.exports.getUserAvatarPath = getUserAvatarPath;