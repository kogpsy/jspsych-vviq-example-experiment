# VVIQ Questionnaire Example Experiment

A jsPsych experiment that uses the [`jspsych-vviq`][1] package to provide a ready-to-use, digital version of the Vividness of Visual Imagery Questionnaire (VVIQ; originally developed by Marks, 1973). To learn about what exact version of the VVIQ is provided, check out the aforementioned base package.

## How to use

There are two options for how to use this experiment, you can either run it locally in a web browser or online via [JATOS][2]. It is assumed that you have received this manual in a zip bundle which contains all other required files and folders. If that is not the case, grab the latest release [here][3]. Download the zip bundle named `jspsych-vviq-experiment_vX.X.X-LL.zip` where `X.X.X` corresponds to the version (you most probably want the most recent one) and `LL` corresponds to the language (`de` for German, `en` for English).

### Locally in a web browser

If your participants fill out the VVIQ as a part of a lab study, it is totally fine to just run the experiment locally.

Open the `index.html` file which you find in the directory `jspsych-vviq-experiment_x.x.x_BROWSER` in a web browser of your choice (Firefox is recommended). A download prompt will allow you to download the participant data after the questionnaire has finished.

### JATOS

To use the experiment as an online survey with the help of JATOS, just import the file `jspsych-vviq-experiment_x.x.x_JATOS.jzip` as a _JATOS Study_ using the _Import Study_ button.

## Notes on the data produced

jsPsych and JavaScript in general work very well together with the JSON data format. For data analysis this might not be very intuitive in the beginning, since tabular data formats, such as CSV, are much more common.

JSON allows indefinitely deep data nesting, which makes the transformation to a tabular format a non-trivial process, depending on the JSON complexity. jsPsych provied a way to export CSV directly, but fails already at rather low data complexity (the result is a CSV file with JSON strings as cell data).

This is why it is probably better to export the data as JSON from jsPsych and do the transformation manually.

Certain jsPsych plugins, such as the SurveyLikertPlugin, which offer the possibility to display multiple questions on one page, will not save the response data question by question so that one row in a CSV would correspond to one question. Instead it nests all responses of one page together in a single data point. To produce a more common, tabular data frame it is necessary to un-nest these data points.

In the directory `data_cleaning` there is an RStudio project demonstrating how to construct a tidy dataset from the response data of a single participant.

[1]: https://github.com/kogpsy/jspsych-vviq
[2]: https://www.jatos.org/
[3]: https://github.com/kogpsy/jspsych-vviq-example-experiment/releases
