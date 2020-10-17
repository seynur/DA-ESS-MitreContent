import * as SplunkHelpers from './splunk_helpers.js'

async function create_password_storage(splunk_js_sdk_service, api_key){
  var storagePasswords = splunk_js_sdk_service.storagePasswords();
  var user_name_to_delete = ":attackdetection_apikey:";
  var user_name = "attackdetection_apikey";
  await storagePasswords.fetch();
  console.log(storagePasswords);
  var storages_found = storagePasswords.list();
  console.log(storages_found);
  for (var index = 0; index < storages_found.length; index++) {
      var storage_found = storages_found[index].name;
      console.log(storage_found);
      if (storage_found === user_name_to_delete ) {
          console.log('trying to delete');
          await storagePasswords.del(user_name);
      }
  }
  await storagePasswords.create({
    name: user_name,
    realm: "",
    password: api_key},
    function(err, storagePassword) {
        if (err) {
          console.log("Password storage error!");
        }
        else {
        // Storage password was created successfully
        console.log("Password storage created!");
        }
    });
}

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
  create_password_storage,
}
