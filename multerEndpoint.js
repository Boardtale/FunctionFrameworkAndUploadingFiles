const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

function addMulterEndpoint(app) {
    // Works perfectly for app.listen(3000
    app.post('/upload/multer', upload.single('file'), (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.'); // ERROR: This is returned via functions-framework
        }

        const targetPath = path.join(__dirname, 'uploads', 'file_multer.jpg');

        fs.rename(req.file.path, targetPath, (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.status(500).send('Error saving file.');
            }

            res.send('File uploaded and saved successfully');
        });
    });
}

module.exports = { addMulterEndpoint };
