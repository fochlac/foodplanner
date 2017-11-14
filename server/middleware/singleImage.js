const multer = require('multer')
    , storage = multer.diskStorage({
        destination: process.env.FOOD_CLIENT + 'images/meals/',
        filename: function (req, file, cb) {
            let splitfile = file.originalname.split('.'),
                ending = splitfile[splitfile.length - 1];

            cb(null, 'tempfile_' + Date.now() + '.' + ending);
        }
    }),
    uploader    = multer({ storage: storage });

module.exports = uploader;