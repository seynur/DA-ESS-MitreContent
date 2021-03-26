"use strict";

import * as Splunk from './splunk_helpers.js'
import * as Setup from './setup_configuration.js'
import get_template from './mitre_setup_template.js'

const DUMMYKEY = 'dummykeyvalue'
const SAVED_SEARCHES = 'savedsearches'
const MACROS = 'macros'
const app_name = "DA-ESS-MitreContent"
const application_name_space = {
    owner: "nobody",
    app: app_name,
    sharing: "app",
};

//var splunk_js_sdk_service = [];
define(
    ["backbone", "jquery", "splunkjs/splunk"],
    function(Backbone, jquery, splunk_js_sdk) {
        var MitreSetupView = Backbone.View.extend({
            // -----------------------------------------------------------------
            // Backbone Functions, These are specific to the Backbone library
            // -----------------------------------------------------------------
            initialize: function initialize() {
                Backbone.View.prototype.initialize.apply(this, arguments);
            },

            events: {
                "click .setup_button": "trigger_setup",
            },

            render: function() {
                this.splunk_js_sdk_service = Setup.create_splunk_js_sdk_service(
                    splunk_js_sdk,
                    application_name_space,
                );
                var savedsearches_current_options = [];
                var splunk_js_sdk_dummy = this.splunk_js_sdk_service;
                this.el.innerHTML = get_template();
                $("input[class=checkbox-lookup]").each(function (n){
                  var stanza_object = {stanza: null};
                  var label_q = "label[id=" + $(this).attr('id') + "]";
                  var input_q = "input[name=" + $(this).attr('id') + "]";
                  stanza_object.stanza = $(label_q).text();
                  Splunk.get_current_conf_to_view(splunk_js_sdk_dummy,SAVED_SEARCHES,stanza_object.stanza).then((properties) => {
                    if (properties.enableSched > 0) {
                      $(this).prop('checked',true)
                    } else {
                      $(this).prop('checked',false)
                    }
                    $(input_q).val(properties.cron_schedule);
                    $("div[class='spinnerBG']").fadeOut();
                    $("div[class='spinnerShow']").fadeOut();
                  });

                });
                var use_es_cb = $("input[class=checkbox-es]");
                Splunk.get_current_conf_to_view(splunk_js_sdk_dummy,MACROS, use_es_cb.attr('id')).then((properties) => {
                  if (properties.definition.match(/\S+1\S+/g)) {
                    use_es_cb.prop('checked',true)
                  } else {
                    use_es_cb.prop('checked',false)
                  }
                });
                return this;
            },
            // ----------------------------------
            // Main Setup Logic
            // ----------------------------------
            trigger_setup: async function trigger_setup(savedsearches_setup_options) {
                var api_key_input_element = jquery("input[name=api_key]");
                var api_key = api_key_input_element.val();
                let verify_api_key = this.verify_alphanumeric_key(api_key);
                const verified_api_key = verify_api_key[0], is_valid_api_key = verify_api_key[1];
                console.log("is_valid_api_key");
                console.log(is_valid_api_key);



                var secret_key_input_element = jquery("input[name=secret_key]");
                var secret_key = secret_key_input_element.val();

                let verify_secret_key = this.verify_alphanumeric_key(secret_key);
                const verified_secret_key = verify_secret_key[0], is_valid_secret_key = verify_secret_key[1];
                console.log("is_valid_secret_key");
                console.log(is_valid_secret_key);

                if (is_valid_api_key === true && is_valid_secret_key === true) {

                  if (verified_api_key !== DUMMYKEY) {
                    this.perform_password_setup(
                      splunk_js_sdk,
                      "attackdetection_apikey",
                      verified_api_key
                     )
                     // If we have a valid API Key, check for non-empty Secret
                     if (verified_secret_key !== DUMMYKEY) {
                       this.perform_password_setup(
                         splunk_js_sdk,
                         "attackdetection_secretkey",
                         verified_secret_key
                       )
                     }
                  }

                  var savedsearches_setup_options = this.get_savedsearches_setup_options();
                  this.perform_setup(
                    savedsearches_setup_options,
                    SAVED_SEARCHES
                  )
                  var macros_setup_options = this.get_macros_setup_options();
                  this.perform_setup(
                    macros_setup_options,
                    MACROS
                  )
                  await Setup.complete_setup(this.splunk_js_sdk_service,app_name);

                  console.log("clear_error_output");
                  this.clear_error_output();

                  var success_response = 'Success: Configuration is saved!';
                  this.display_success_output(success_response);

                } else {
                    this.clear_success_output();
                    var key_error = 'Error: Please check your API/Secret Key!';
                    console.log("display_error_output");
                    this.display_error_output(key_error);
                  }
                },

            get_savedsearches_setup_options: function get_savedsearches_setup_options(){
              var setup_options = [];
              $("input[class=checkbox-lookup]").each(function (n){
                var stanza_object = {stanza: null, properties: {cron_schedule:null, enableSched:null}};
                var label_q = "label[id=" + $(this).attr('id') + "]";
                var input_q = "input[name=" + $(this).attr('id') + "]";
                stanza_object.stanza = $(label_q).text();
                stanza_object.properties.cron_schedule = $(input_q).val();
                if ($(this).is(':checked')) {
                  stanza_object.properties.enableSched = 1;
                } else {
                  stanza_object.properties.enableSched = 0;
                }
                setup_options.push(stanza_object);
              });
              return setup_options;
            },
            get_macros_setup_options: function get_macros_setup_options(){
              var setup_options = [];
              var use_es_cb = $("input[class=checkbox-es]");
              var use_es_stanza_object = {stanza: use_es_cb.attr('id'), properties: {definition:null}};
              var mitre_rules_stanza_object = {stanza: 'mitre_rules', properties: {definition:null}}
              if (use_es_cb.is(':checked')) {
                use_es_stanza_object.properties.definition = '"1"';
                mitre_rules_stanza_object.properties.definition = '`mitre_rules_from_notable`'
              } else {
                use_es_stanza_object.properties.definition = '"0"';
                mitre_rules_stanza_object.properties.definition = '`mitre_rules_from_alerts`'
              }
              setup_options.push(use_es_stanza_object);
              setup_options.push(mitre_rules_stanza_object);
              return setup_options;
            },
            perform_setup: async function perform_setup(setup_options,configuration_file_name) {
                $("div[class='spinnerBG']").fadeIn();
                $("div[class='spinnerShow']").fadeIn();

                try {

                    await Splunk.update_configuration_file(
                          this.splunk_js_sdk_service,
                          configuration_file_name,
                          setup_options
                    )

                    //Setup.redirect_to_splunk_app_homepage(splunk_js_sdk_service,app_name);

                    console.log(" Configuration Success");
                } catch (error) {
                    console.log(error);
                    console.log("An error occured!");
                }

            },

            perform_password_setup: async function perform_password_setup(splunk_js_sdk, key_name, key_value) {

                try {
                    const splunk_js_sdk_service = Setup.create_splunk_js_sdk_service(
                        splunk_js_sdk,
                        application_name_space,
                    );
                    await Setup.create_password_storage(
                        splunk_js_sdk_service,
                        key_name,
                        key_value
                    )
                    return true;
                    console.log("Password: Success!");

                } catch (error) {
                    console.log("An error occured(Password)!");
                }
            },
            // ----------------------------------
            // Input Cleaning and Checking
            // ----------------------------------
            verify_alphanumeric_key: function verify_alphanumeric_key(input_key) {
                var sanitized_key = input_key.trim();
                var is_alphanumeric_regex = RegExp('^[A-Za-z0-9]{32}$');
                var is_empty_regex = RegExp('^\s*$');
                var is_key_alphanumeric = is_alphanumeric_regex.test(sanitized_key);
                var is_key_empty = is_empty_regex.test(sanitized_key);
                var is_valid_key = false;

                if (is_key_alphanumeric || is_key_empty){
                  is_valid_key = true;
                  if (is_key_empty) {
                    sanitized_key = DUMMYKEY
                  }
                }

                return [sanitized_key, is_valid_key];

            },

            // ----------------------------------
            // Display Functions
            // ----------------------------------
            clear_success_output: function clear_success_output() {
                var clear_success_output_element = jquery(".setup.container .success.output");
                clear_success_output_element.fadeOut({
                    complete: function() {
                        clear_success_output_element.html("");
                    },
                });
            },
            clear_error_output: function clear_error_output() {
                var clear_error_output_element = jquery(".setup.container .error.output");
                clear_error_output_element.fadeOut({
                    complete: function() {
                        clear_error_output_element.html("");
                    },
                });
            },
            display_success_output: function display_success_output(success_message) {
                var did_success_messages_occur = success_message.length > 0;
                var success_output_element = jquery(".setup.container .success.output");
                var new_success_output_string = "";
                new_success_output_string += "<ul>" + success_message + "</ul>" ;
                success_output_element.html(new_success_output_string);
                $("div[class='spinnerBG']").fadeOut();
                $("div[class='spinnerShow']").fadeOut();
                success_output_element.stop();
                success_output_element.fadeIn();
            },
            display_error_output: function display_error_output(error_message) {
                var did_error_messages_occur = error_message.length > 0;
                var error_output_element = jquery(".setup.container .error.output");
                var new_error_output_string = "";
                new_error_output_string += "<ul>" + error_message + "</ul>" ;
                error_output_element.html(new_error_output_string);
                $("div[class='spinnerBG']").fadeOut();
                $("div[class='spinnerShow']").fadeOut();
                error_output_element.stop();
                error_output_element.fadeIn();
            },

        });
        return MitreSetupView;
    },
);
