"use strict";

var app_name = "DA-ESS-MitreContent";

// This is an undocumented Splunk solution for how to include javascript logic
// from other files.
// Declare a require.config() and proviade a dictionary that has a `paths` keys.
// In the `paths` key provide another dictionary that declares custom classes.
// Each key should be the class name, and the value the path to the javascript file
// ../app/<extracted_folder_name_of_app>/<path to javascript file>(no extension)
// Then include those in the require method's array, and function.

// Common gotchas:
// 1) The path to the script autmatically appends .js, so don't include it
// 2) This only provides supprt for JavaScript files, plain-text html files won't work
// 3) The "../app" is required as a prefix and your app name is required to follow it
// 4) After the app name, the path is provided as though it were from the
//    $SPLUK_HOME/etc/apps/appserver/static/* directory
require.config({
  paths: {
    SetupPage: "../app/" + app_name + "/setup_view/javascript/mitre_setup_main",
    jquery_local: "../app/"  + app_name +  "/lib/js/jquery-3.6.0.min"
  },
  scriptType: "module"
});

require([
    "backbone", // From the Splunk JS stack
    "jquery_local", // From the local JS stack
    // Custom files
    "SetupPage",
],function(Backbone, jquery, SetupPage) {

    var mitre_setup_page = new SetupPage({
        // Sets the element that will be used for rendering
        el: $("#main_container"),
    });

    mitre_setup_page.render();
});
