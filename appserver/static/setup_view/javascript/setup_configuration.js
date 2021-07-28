import * as SplunkHelpers from './splunk_helpers.js'

async function complete_setup(splunk_js_sdk_service,app_name) {
  var configuration_file_name = "app";
  var app_setup_options = [
    {stanza: 'install', properties: {is_configured: "true"}},
  ]
  await SplunkHelpers.update_configuration_file(
      splunk_js_sdk_service,
      configuration_file_name,
      app_setup_options
  );
  await reload_splunk_app(splunk_js_sdk_service,app_name);
};

async function reload_splunk_app(
  splunk_js_sdk_service,
  app_name,
) {
  var splunk_js_sdk_apps = splunk_js_sdk_service.apps();
  await splunk_js_sdk_apps.fetch();

  var current_app = splunk_js_sdk_apps.item(app_name);
  await current_app.reload();
};

function create_splunk_js_sdk_service(
  splunk_js_sdk,
  application_name_space,
) {
  var http = new splunk_js_sdk.SplunkWebHttp();

  var splunk_js_sdk_service = new splunk_js_sdk.Service(
      http,
      application_name_space,
  );

  return splunk_js_sdk_service;
};

export {
  complete_setup,
  reload_splunk_app,
  create_splunk_js_sdk_service,
}
