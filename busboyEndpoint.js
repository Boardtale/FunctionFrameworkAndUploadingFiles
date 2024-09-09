const fs = require('fs');
const path = require('path');
const busboy = require('busboy');

// Works perfectly for app.listen(3000
/* ERROR for functions-framework:
Error parsing the file upload: Error: Unexpected end of form
    at Multipart._final (W:\workspace\playground\node_modules\busboy\lib\types\multipart.js:588:17)
    at prefinish (node:internal/streams/writable:914:14)
    at finishMaybe (node:internal/streams/writable:928:5)
    at Writable.end (node:internal/streams/writable:843:5)
    at onend (node:internal/streams/readable:946:10)
    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)
Exception from a finished function: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
 */
function addBusboyEndpoint(app) {
    app.post('/upload/busboy', (req, res) => {
        console.log(req.headers)
        const bb = busboy({ headers: req.headers });
        let saveFile = null;
        let filePromise = null;

        bb.on('file', (name, file, info) => {
            const saveTo = path.join(__dirname, 'uploads', 'file_busboy.jpg');
            saveFile = fs.createWriteStream(saveTo);
            file.pipe(saveFile);

            filePromise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    saveFile.end();
                    resolve();
                });
                saveFile.on('error', reject);
            });
        });

        bb.on('close', async () => {
            if (!filePromise) {
                return res.status(400).send('No file uploaded.');
            }

            try {
                await filePromise;
                res.send('File uploaded and saved successfully');
            } catch (err) {
                console.error('Error saving file:', err);
                res.status(500).send('Error saving file.');
            }
        });

        bb.on('error', (err) => {
            console.error('Error parsing the file upload:', err);
            res.status(500).send('Error processing file upload.');
        });

        req.pipe(bb);
    });
}

module.exports = { addBusboyEndpoint };
