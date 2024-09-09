const fs = require('fs');
const path = require('path');

function addNativeEndpoint(app) {
    // Does not work for app.listen - it saves a file but it is adding extra characters
    // For functions-framework it hangs never returning any response
    app.post('/upload/native', (req, res) => {
        console.log(req.headers)
        if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
            let body = '';
            const boundary = req.headers['content-type'].split('boundary=')[1];
            let fileName = '';
            let fileData = '';
            let isFile = false;

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const parts = body.split(`--${boundary}`);
                for (let part of parts) {
                    if (part.includes('filename=')) {
                        fileName = part.match(/filename="(.+)"/)[1];
                        isFile = true;
                    }
                    if (isFile && part.includes('\r\n\r\n')) {
                        fileData = part.split('\r\n\r\n')[1].trim();
                        break;
                    }
                }

                if (!fileData) {
                    return res.status(400).send('No file uploaded.');
                }

                const targetPath = path.join(__dirname, 'uploads', 'file_native.jpg');

                fs.writeFile(targetPath, fileData, 'binary', (err) => {
                    if (err) {
                        console.error('Error saving file:', err);
                        return res.status(500).send('Error saving file.');
                    }

                    res.send('File uploaded and saved successfully');
                });
            });
        } else {
            res.status(400).send('Invalid content type. Expected multipart/form-data.');
        }
    });
}

module.exports = { addNativeEndpoint };
