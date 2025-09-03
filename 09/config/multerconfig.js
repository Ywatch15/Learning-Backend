const multer = require('multer');
const path= require('path');
const crypto = require('crypto')


//disk storage set-up
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(14, (err, bytes) => {
            if (err) return cb(err);
            const fn = bytes.toString('hex') + path.extname(file.originalname);
            cb(null, fn);
        });
    }
})

//export upload variable
const upload = multer({ storage: storage });

module.exports = upload;
