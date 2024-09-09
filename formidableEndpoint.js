const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// Works find for app.listen(3000
// ERROR: for functions-framework it hangs as it never enter form.parse
function addFormidableEndpoint(app) {
    app.post('/upload/formidable', (req, res) => {
        const form = new formidable.IncomingForm({
            uploadDir: path.join(__dirname, 'uploads'),
            keepExtensions: true,
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing the file upload:', err);
                return res.status(500).send('Error processing file upload.');
            }

            const uploadedFile = Object.values(files)[0]?.[0];

            if (!uploadedFile) {
                return res.status(400).send('No file uploaded.');
            }

            const filename = 'file_formidable.jpg';
            const targetPath = path.join(__dirname, 'uploads', filename);

            fs.rename(uploadedFile.filepath, targetPath, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    return res.status(500).send('Error saving file.');
                }

                res.send('File uploaded and saved successfully');
            });
        });
    });
}

module.exports = { addFormidableEndpoint };
