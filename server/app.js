const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const generatePDF = require('./helper');

const app = express();
const port = 7000;

// parse req body
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/generate-pdf', async (req, res) => {
  // get the students array from req body
  const students = req.body;

  // read the html template
  const htmlTemplate = fs.readFileSync(
    path.resolve(__dirname, './templates/sample.html'),
    'utf-8'
  );

  // create a folder to store the pdfs
  const pdfFolderPath = path.resolve(__dirname, './pdfs');
  // create the folder if it doesn't exist
  if (!fs.existsSync(pdfFolderPath)) {
    fs.mkdirSync(pdfFolderPath);
  }

  // create a unique pdf name
  const pdfName = `students_${Date.now()}.pdf`;
  const pdfFilePath = path.join(pdfFolderPath, pdfName);

  // create rows with students data
  const tableRows = students
    .map(
      (student, id) => `
    <tr>
      <td>${id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.major}</td>
    </tr>
  `
    )
    .join('');

  // replace the placeholder in html template with actual table rows with student data
  const html = htmlTemplate.replace('{{DataHere}}', tableRows);

  try {
    // generate pdf
    const file = await generatePDF(html, pdfName, pdfFilePath);

    if (!file) {
      throw new Error('Error generating PDF');
    }

    // convert pdf to base64
    const bitmap = await fs.promises.readFile(pdfFilePath);
    const pdfBase64 = Buffer.from(bitmap).toString('base64');

    // unlink the file - optional - deletes file from server
    if (fs.existsSync(pdfFilePath)) {
      fs.unlinkSync(pdfFilePath);
    }

    // send the base64 pdf as response
    res.send({
      file: pdfBase64,
      message: 'Success!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
