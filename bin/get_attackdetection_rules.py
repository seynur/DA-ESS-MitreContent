from __future__ import absolute_import, division, print_function, unicode_literals
import os,sys
import time
import xml.etree.ElementTree as ET
import json
import requests
import hmac
import hashlib
import base64
import random, string

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'DA-ESS-MitreContent', 'lib'))
from seynurlib.validation import *
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from splunklib.six.moves import range

APPCONTEXT='DA-ESS-MitreContent'
APIENDPOINT1='https://api.seynur.com/v1/attack-detection'
APIENDPOINT2='https://api.seynur.com/v2/attack-detection/get-rules'
APILOOKUPFILE='mitre_api_rule_technique_lookup.csv'

@Configuration()
class GetAttackDetectionRulesCommand(GeneratingCommand):

    def getPasswordKeyFromConfig(self, key_name):
        sp = self.service.storage_passwords
        result_stream = sp.get(name=key_name,app=APPCONTEXT)['body'].read().decode("utf-8")
        xmlroot = ET.fromstring(result_stream)
        key_value = ''
        for elem in xmlroot.findall(".//*[@name='clear_password']"):
            key_value=elem.text
            return key_value

    def getRulesFromApi(self, apikey, secretkey, url):
        headers = {}
        if secretkey:
            # nonce with 8 random alphanumeric characters
            nonce = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k = 8))
            # Authrization header with HMAC authentication
            authorization_header="HMAC-SHA512 " + nonce + "|" + base64.b64encode(hmac.new(bytes(secretkey,'utf-8'), bytes(nonce+apikey, 'utf-8'), hashlib.sha512).digest()).decode()

            headers = {'content-type': "application/x-www-form-urlencoded",
            'cache-control': "no-cache",
            'apikey' : '{}'.format(apikey),
            'Authorization': '{}'.format(authorization_header)}
        else:
            headers = {'content-type': "application/x-www-form-urlencoded",
            'cache-control': "no-cache",
            'apikey' : '{}'.format(apikey)}

        response = requests.request("POST", url, headers=headers)
        try:
            rules = json.loads(response.text)
        except:
            if(response.status_code==200):
                raise Exception("GetAttackDetectionRules Exception: Unable to authenticate request.  Please verify your API Key.")
        return rules

    def addSavedSearch(self, rule_name, description, spl, technique_id, security_domain, severity, fields):
        rule_title = rule_label = rule_name.replace("- Rule","").strip()

        rule_title += " - For fields:"
        for i in fields.split(","):
            rule_title += " $" + i + "$"

        rule_description = description + " - MITRE ATT&CK Techniques: " + technique_id

        kwargs_createsearch = {"description": rule_description,
                                "disabled": 1,
                                "action.alert_manager.param.title": "$name$",
                                "action.correlationsearch.enabled": 1,
                                "action.correlationsearch.label": rule_label,
                                "alert.suppress" : 0,
                                "cron_schedule" : "*/5 * * * *",
                                "dispatch.earliest_time" : "-24h",
                                "dispatch.latest_time" : "now",
                                "action.customsearchbuilder.spec" : "{}",
                                "action.notable": 1,
                                "action.notable.param.security_domain": security_domain,
                                "action.notable.param.severity": severity,
                                "action.notable.param.nes_fields": fields,
                                "action.notable.param.rule_title": rule_title,
                                "action.notable.param.rule_description": rule_description}

        self.service.saved_searches.create(rule_name, spl, **kwargs_createsearch)


    def createLookupGenerationString(self, rules):
        rule_count = len(rules)
        base_case_string = 'count={}, "{}"'
        rule_name_case_string = ''
        technique_id_case_string = ''
        for rule in rules:
            rule_name_case_string = rule_name_case_string + "," + base_case_string.format(rule['id'], rule['rule_name'])
            technique_id_case_string = technique_id_case_string + "," + base_case_string.format(rule['id'], rule['technique_id'])
        rule_name_case_string = rule_name_case_string[1:]
        technique_id_case_string = technique_id_case_string[1:]
        base_rule_name_string = '| eval rule_name=case({})'
        base_technique_id_string = '| eval technique_id=case({})'
        rule_name_string = base_rule_name_string.format(rule_name_case_string)
        technique_id_string = base_technique_id_string.format(technique_id_case_string)
        base_search_string = '| makeresults count={} | streamstats count {} {} | table rule_name, technique_id | outputlookup ' + APILOOKUPFILE
        search_string = base_search_string.format(rule_count, rule_name_string, technique_id_string)
        return search_string


    def createLookup(self, rules):
        lookup_gen_search = self.createLookupGenerationString(rules)
        kwargs_export = {}
        search_results = self.service.jobs.export(lookup_gen_search, **kwargs_export)
        return search_results

    def generate(self):
        try:
          apikey = self.getPasswordKeyFromConfig("attackdetection_apikey")
          secretkey = self.getPasswordKeyFromConfig("attackdetection_secretkey")

          if is_alphanumeric(apikey, 32):
              if secretkey and is_alphanumeric(secretkey, 32):
                  api_rules = self.getRulesFromApi(apikey, secretkey, APIENDPOINT2)
              else:
                  api_rules = self.getRulesFromApi(apikey, None, APIENDPOINT1)

              splunk_rule_names = []
              for search in self.service.saved_searches:
                  splunk_rule_names.append(search.name)

              for api_rule in api_rules:
                  if api_rule['rule_name'] not in splunk_rule_names :
                      self.addSavedSearch(api_rule['rule_name'],
                                      api_rule['description'],
                                      api_rule['spl'],
                                      api_rule['technique_id'],
                                      api_rule['security_domain'],
                                      api_rule['severity'],
                                      api_rule['fields'])

              self.createLookup(api_rules)

              self.logger.info("Attack Detection API: Successfully completed.")
              text = 'Attack Detection API: Successfully completed.'
          else:
              raise Exception('GetAttackDetectionRules Error: Unable to send request.  The API key must be a 32 character string comprised of alphanumeric characters.')
        except: # catch *all* exceptions
          t, value, tb = sys.exc_info()
          self.logger.error( "Attack Detection API: EXCEPTION %s: %s" % (t,value) )
          text = 'Attack Detection API: EXCEPTION %s: %s' % (t,value)

        yield {'_time': time.time(), '_raw': text}

dispatch(GetAttackDetectionRulesCommand, sys.argv, sys.stdin, sys.stdout, __name__)
