/**
 * @title Survey
 * @description
 * @version 1.0.0
 */

// Import stylesheets (.scss or .css).
import '../styles/main.scss';

// Import jsPsych and plugins
import { initJsPsych } from 'jspsych';
import SurveyHtmlFormPlugin from '@jspsych/plugin-survey-html-form';

// Import vviq related code
import { generateVviqTimeline } from '@kogpsy/jspsych-vviq';

// Import the language field from package.json
import packageJson from '../package.json';

// Constant controlling the language of the whole experiment
const LANGUAGE: string = packageJson.language;

/**
 * This method will be executed by jsPsych Builder and is expected to run the
 * jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the
 * JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context
 * in which the experiment is run: `development` for `jspsych run`, `production`
 * for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc:
 * string[];}} options.assetPaths An object with lists of file paths for the
 * respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  // Initiate the jsPsych object
  const jsPsych = initJsPsych();

  // Define the main timeline array
  const timeline = [];

  // Declare the string variables for localization of the first trial
  let welcomeString: string;
  let participantIdString: string;

  // Set the strings of the first trial based on LANGUAGE
  switch (LANGUAGE) {
    case 'german':
      welcomeString = 'Willkommen';
      participantIdString = 'Bitte geben Sie die Versuchspersonen ID hier ein';
      break;
    case 'english':
      welcomeString = 'Welcome';
      participantIdString = 'Please enter the participant ID here';
      break;
  }

  // First trial capturing the participant ID
  timeline.push({
    type: SurveyHtmlFormPlugin,
    html: `
      <h3> ${welcomeString} </h3>
      <p> ${participantIdString}: </p>
      <p>
        <input
          name="participant_id"
          id="participant_id"
          type="text"
          class="text-input"
          required />
      </p>
    `,
    autofocus: 'participant_id',
    on_finish: (data) => {
      // Add the participant id to all datapoints
      jsPsych.data.addProperties({
        participant_id: data.response.participant_id,
      });
    },
  });

  // Generate the VVIQ timeline and push it to the main timeline
  timeline.push(generateVviqTimeline(LANGUAGE));

  // Run the experiment
  await jsPsych.run(timeline);

  // Get the resulting data
  const resultData = jsPsych.data.get();
  // If the experiment is run by JATOS, pass the resulting data to the server
  // in CSV form.
  if (environment === 'jatos') {
    // Some editors may throw errors here if TypeScript is used, since the jatos
    // object is not created here but injected at runtime. This is why for the
    // following line, TypeScript errors are ignored.
    // @ts-ignore
    jatos.submitResultData(resultData.json(), jatos.startNextComponent);
  }
  // In every other environment, print the data to the browser console in JSON
  // form. Here you can adjust what should happen to the data if the experiment
  // is served, e.g. by a common httpd server.
  else {
    console.log('End of experiment. Results:');
    console.log(resultData);
    resultData.localSave('json', 'data.json');
  }
}
