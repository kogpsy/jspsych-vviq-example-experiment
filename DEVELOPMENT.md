# Development

To start developing, make sure you have Node.js and Yarn installed. Clone the repo and run `yarn install` to fetch all dependencies.

## Available scripts

**`yarn run dev`**

This will spin up the development server under http://localhost:3000. When the experiment timeline is finished, the participant data will be printed on the browser console and offered as a download.

**`yarn run build`**

This will compile and package the source files into a `.zip` file and save it in the `packaged` directory. The contained files can be served on any webserver or even run locally in a browser. The data is again printed on the browser console and offered as download, when the timeline is finished.

**`yarn run build --jatos`**

This will compile and package the source files into a `.jzip` file and save it in the `packaged` directory. The package can be imported in a JATOS server (using the GUI option _Import Study_). The resulting data is passed to the JATOS server in JSON form.

**`yarn run bundle`**

Builds the experiment for local use as well as for JATOS, then creates a bundle containing all required files as well as a manual. The result is placed under `bundle`.

## Distribution

To distribute, the idea is do create bundles by running `yarn run bundle`, and then distribute these bundles. Since `jspsych-vviq` supports both English and German, two bundles should be created. This has not yet been automated, but to do so, run `yarn run bundle` once, then change the `language` field under `package.json` to `"german"` and run `yarn run bundle` again. In the end, change the `language` field under `package.json` back to `"english"`, because english is the default language of this repo (this is just a convention).
