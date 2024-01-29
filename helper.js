const generatePDF = async (htmlTemplate, pdfName, pdfFilePath) => {
  try {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath:
        'c:\\Users\\Hassan\\Development\\drivers\\chrome-win\\chrome.exe', // set your chrome path here
    });

    // Create a new page
    const page = await browser.newPage();

    // Load your HTML template into the page
    await page.setContent(htmlTemplate, {
      waitUntil: 'domcontentloaded',
    });

    // Emulate screen media type
    await page.emulateMediaType('screen');

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Get a PDF buffer from the page
    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      printBackground: true,
      format: 'A4',
      displayHeaderFooter: true,
    });

    // Write the PDF buffer to a file
    await fs.promises.writeFile(pdfFilePath, pdfBytes);

    // Close the browser
    await browser.close();

    // Return the name of the file that was saved
    return pdfName;
  } catch (error) {
    console.log(error, 'Error generating PDF');
    return null;
  }
};

module.exports = generatePDF;
