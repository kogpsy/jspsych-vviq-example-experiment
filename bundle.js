/**
 * This node script creates a distributable zip bundle.
 */

const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const JSZip = require('jszip');

// Grab version and language from package.json
const pkgJson = JSON.parse(fs.readFileSync('package.json'));
const VERSION = pkgJson.version;

// Parse language in a very ugly way
const LANGUAGE =
  pkgJson.language === 'english'
    ? 'en'
    : pkgJson.language === 'german'
    ? 'de'
    : 'error';

(async () => {
  // Instantiate the new bundle
  const zip = new JSZip();

  // Read the old zip
  const browserPackage = await JSZip.loadAsync(
    fs.readFileSync(`packaged/experiment_${VERSION}.zip`)
  );
  // Rename the files of the browser package since it's not intuitive this my
  // scenario.
  // This is pretty hacky, but should do the job.
  for (key in browserPackage.files) {
    // Create a new key
    const newKey = key.replace(
      'experiment',
      `jspsych-vviq-experiment_v${VERSION}_BROWSER`
    );
    // Rename the key
    renameKey(browserPackage.files, key, newKey);
    // Rename the name field's content
    browserPackage.files[newKey].name = newKey;
  }

  // Add ZipObjects of the browser package to the new zip manually
  for (key in browserPackage.files) {
    zip.files[key] = browserPackage.files[key];
  }

  // Create pdf data from readme md and push to new zip
  const pdfData = await mdToPdf({ path: 'README.md' }).catch(console.error);
  zip.file('manual.pdf', pdfData.content);

  // Read jatos package and push to new zip
  const jatosPackage = fs.readFileSync(`packaged/experiment_${VERSION}.jzip`);
  zip.file(`jspsych-vviq-experiment_v${VERSION}_JATOS.jzip`, jatosPackage);

  // Add R project
  const rScriptData = fs.readFileSync('data_cleaning/data_cleaning.R');
  const rDataData = fs.readFileSync('data_cleaning/sample_data.json');
  const rProjectData = fs.readFileSync(
    'data_cleaning/vviq_data_cleaning.Rproj'
  );

  zip.file('data_cleaning/data_cleaning.R', rScriptData);
  zip.file('data_cleaning/sample_data.json', rDataData);
  zip.file('data_cleaning/vviq_data_cleaning.Rproj', rProjectData);

  // Create the bundle dir if it does not exist
  if (!fs.existsSync('bundle')) {
    fs.mkdirSync('bundle', { recursive: true });
  }

  const bundleFilename = `jspsych-vviq-experiment_v${VERSION}-${LANGUAGE}.zip`;

  // Write the zip to bundle directory
  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(`bundle/${bundleFilename}`))
    .on('finish', function () {
      console.log(`Bundle created: ${bundleFilename}`);
    });
})();

// Function to rename a key in an object properly. Taken from:
// - https://stackoverflow.com/questions/4647817/javascript-object-rename-key
const renameKey = (obj, oldKey, newKey) => {
  if (oldKey !== newKey) {
    Object.defineProperty(
      obj,
      newKey,
      Object.getOwnPropertyDescriptor(obj, oldKey)
    );
    delete obj[oldKey];
  }
};
