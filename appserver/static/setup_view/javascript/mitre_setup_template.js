function get_template() {
  const template_string =
      "<div class='spinnerBG'></div>" +
      "<div class='spinnerShow'></div>" +
      "<div class='title'>" +
      "   <h1>MITRE ATT&amp;CK App for Splunk - Initial Setup</h1>" +
      "<br><br/>" +
      "This setup page provides configuration options for API integration and Lookup Generating searches." +
      "<br/>" +
      "You can find more information on <a href='https://www.seynur.com/api' target='_blank'> https://www.seynur.com/api </a>" +
      "<br/>" +
      "For a quick start simply hit Save button to continue" +
      "<br/>" +
      "<b>Note:</b>'Get Attack Detection Rules' search tries to connect to API gateway" +
      "<hr>" +
      "</div>" +
      "<div class='setup container'>" +
      "<b>Attack Detection API Key</b>" +
      "<br/>" +
      "        <div class='field api_key'>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>API Key: <input type='password' name='api_key' value=''></input></label>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "<br/>" +
      "        <div class='field secret_key'>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>Secret Key: <input type='password' name='secret_key' value=''></input></label>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "<br/>" +
      "<b>Enable/Disable API and Lookup generating searches.</b>" +
      "<br/>" +
      "<p><i>These are saved searches and can also be modified via Settings after setup.</i></p>" +
      "        <label id='all_rules'><input type='checkbox' class='checkbox-lookup' id='all_rules'>MITRE ATT&amp;CK All Rules and Techniques Lookup Gen</label>" +
      "        <label id='compliance'><input type='checkbox' class='checkbox-lookup' id='compliance'>MITRE ATT&amp;CK Compliance Lookup Gen</label>" +
      "        <label id='ad_rules'><input type='checkbox' class='checkbox-lookup' id='ad_rules'>MITRE ATT&amp;CK Get Attack Detection Rules</label>" +
      "        <label id='user_rules'><input type='checkbox' class='checkbox-lookup' id='user_rules'>MITRE ATT&amp;CK User Rules Compliance Lookup Gen</label>" +
      "<br/>" +
      "<b>Configure Cron Schedule</b>" +
      "<br/>" +
      "<p><i>Only applicable if enabled. These are saved searches and can also be modified via Settings after setup.</i></p>" +
      "        <div class='field api_key'>" +
      "            </br>" +
      "        <div class='field secret_key'>" +
      "            </br>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>MITRE ATT&amp;CK All Rules and Techniques Lookup Gen<input type='text' name='all_rules' value='1 0 * * *'></input></label>" +
      "                </div>" +
      "            </div>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>MITRE ATT&amp;CK Compliance Lookup Gen<input type='text' name='compliance' value='5 0 * * *'></input></label>" +
      "                </div>" +
      "            </div>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>MITRE ATT&amp;CK Get Attack Detection Rules<input type='text' name='ad_rules' value='9 0 * * *'></input></label>" +
      "                </div>" +
      "            </div>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <label>MITRE ATT&amp;CK User Rules Compliance Lookup Gen<input type='text' name='user_rules' value='7 0 * * *'></input></label>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "<br/>" +
      "<b>Configure Enterprise Security Integration</b>" +
      "<br/>" +
      "<p><i>Using Enterprise Security Application is strongly recommended. However, if you'd like to use Alert Manager instead, please uncheck the following checkbox. </i></p>" +
      "        <label id='mitre_use_es'><input type='checkbox' class='checkbox-es' id='mitre_use_es'>Use Enterprise Security App</label>" +
      "        <br/>" +
      "        <div>" +
      "            <button name='setup_button' class='setup_button'>" +
      "                Save" +
      "            </button>" +
      "        </div>" +
      "        <br/>" +
      "        <div class='success output'>" +
      "        </div>" +
      "        <div class='error output'>" +
      "        </div>" +
      "</div>";

  return template_string;
}

export default get_template;
