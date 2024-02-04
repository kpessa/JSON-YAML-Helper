const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jsYaml = require('js-yaml');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  console.log('Serving the Home Page.');
  res.send('Welcome to JSON-YAML-Helper');
});

app.post('/api/convert', upload.single('jsonFile'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded.');
    return res
      .status(400)
      .send('No file uploaded. Please make sure a JSON file is selected.');
  }
  try {
    console.log('Attempting to convert JSON to YAML...');
    const jsonContent = JSON.parse(req.file.buffer.toString());
    const yamlContent = jsYaml.dump(jsonContent);
    console.log('Conversion of JSON to YAML successful.');
    res.send(yamlContent);
  } catch (error) {
    console.error(
      'Error during JSON to YAML conversion:',
      error.message,
      error.stack
    );
    res
      .status(400)
      .send(
        `Error converting JSON to YAML. Please ensure the file is valid JSON. Error: ${error.message}`
      );
  }
});

app.post('/api/export', bodyParser.json(), (req, res) => {
  try {
    console.log('Attempting to convert YAML back to JSON...');
    let yamlContent = req.body.yaml;
    if (!yamlContent) {
      console.log('YAML content is empty or not provided.');
      throw new Error('YAML content is empty or not provided.');
    }
    // Placeholder for potential future content cleaning logic
    // Example: yamlContent = cleanMarkupFromYaml(yamlContent);
    const jsonContent = jsYaml.load(yamlContent);
    console.log('Conversion of YAML to JSON successful.');
    res.json(jsonContent);
  } catch (error) {
    console.error(
      'Error during YAML to JSON conversion:',
      error.message,
      error.stack
    );
    res
      .status(400)
      .send(
        `Error converting YAML back to JSON. Make sure the YAML content is correct. Error: ${error.message}`
      );
  }
});

// Placeholder function for future use, if necessary
function cleanMarkupFromYaml(yamlContent) {
  // Example: return yamlContent.replace(/<\/?[^>]+(>|$)/g, "");
  console.log('Cleaning markup from YAML content.'); // Log for effective troubleshooting
  return yamlContent;
}

app
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  })
  .on('error', error => {
    console.error(`Failed to start server:`, error.message, error.stack);
  });
