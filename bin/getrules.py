import sys
import json
import requests
import base64
import csv
import splunk.entity as entity
import splunk.Intersplunk as si

def getCredentials(sessionKey):
    myapp = 'DA-ESS-MitreContent'
    entities = entity.getEntities(['admin', 'passwords'], namespace=myapp, owner='admin', sessionKey=sessionKey)
    #username = 'api_key'
    for i, c in entities.items():
        if c['username']=='apikey':
            #sys.stderr.write('username: ' + c['username'] + ' password: ' + c['clear_password'])
            return c['username'], c['clear_password']

def getSessionKey():
    #results,dummyresults,settings = si.getOrganizedResults()
    #sessionKey = settings.get("sessionKey")
    #sys.stderr.write(str(sys.stdin.readline()))
    sessionKey = sys.stdin.readline().strip()
    sys.stderr.write(str(sessionKey))
    if len(sessionKey) == 0:
        sys.stderr.write("Did not receive a session key from splunkd. " +
                        "Please enable passAuth in inputs.conf for this " +
                        "script\n")
        exit(2)
    return sessionKey

def addSavedSearch(sessionKey, rule_name, spl, technique_id):
    header_splunk={'content-type': "application/x-www-form-urlencoded", "Authorization": "Basic %s" % sessionKey, 'accept': "application/json"}
    savedsearch_url = 'https://localhost:8089/servicesNS/nobody/DA-ESS-MitreContent/saved/searches'
    payload = 'name='+ rule_name + '&search='+spl+'&description='+technique_id + '&disabled=0' + '&action.correlationsearch.enabled=1' + '&action.correlationsearch.label=' + rule_name.split(' - ')[1]
    requests.request('POST', savedsearch_url, headers=header_splunk, data=payload, verify=False)

def getSavedSearches(sessionKey):
    header={'content-type': "application/x-www-form-urlencoded", "Authorization": "Basic %s" % sessionKey, 'accept': "application/json"}
    savedsearch_url = 'https://localhost:8089/servicesNS/nobody/DA-ESS-MitreContent/saved/searches'
    params = {'output_mode': 'json', 'count':'-1'}
    response = requests.request('GET', savedsearch_url, headers=header, params=params, verify=False)
    splunk_rules = json.loads(response.text)
    return splunk_rules 

def getRulesFromApi(sessionKey):
    url='https://api.seynur.com/v1/attack-detection'
    username, api_key = getCredentials(sessionKey)
    querystring = {username:api_key}
    headers = {'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'apikey' : '{}'.format(api_key)}
    response = requests.request("POST", url, headers=headers)
    rules = json.loads(response.text)
    return rules

def deleteDeprecatedApiRules(sessionKey,rule_name):
    header_splunk={'content-type': "application/x-www-form-urlencoded", "Authorization": "Basic %s" % sessionKey, 'accept': "application/json"}
    savedsearch_url = 'https://localhost:8089/servicesNS/nobody/DA-ESS-MitreContent/saved/searches{}'.format(requests.utils.quote(rule_name))
    requests.request('DELETE', savedsearch_url, headers=header_splunk, verify=False)

def createLookupGenerationString(sessionKey , rules):
    rule_count = len(rules)
    base_case_string = 'count={}, "{}"'
    rule_name_case_string = ''
    technique_id_case_string = ''
    for rule in rules:
        rule_name_case_string = rule_name_case_string + "," + base_case_string.format(rule['rule_id'], rule['rule_name'])
        technique_id_case_string = technique_id_case_string + "," + base_case_string.format(rule['rule_id'], rule['technique_id'])
    rule_name_case_string = rule_name_case_string[1:]
    technique_id_case_string = technique_id_case_string[1:]
    base_rule_name_string = '| eval rule_name=case({})'
    base_technique_id_string = '| eval technique_id=case({})'
    rule_name_string = base_rule_name_string.format(rule_name_case_string)
    technique_id_string = base_technique_id_string.format(technique_id_case_string)
    base_search_string = '| makeresults count={} | streamstats count {} {} | table rule_name, technique_id | outputlookup api_rule1.csv'
    search_string = base_search_string.format(rule_count, rule_name_string, technique_id_string)
    return search_string

def createLookup(sessionKey, rules):
    searchString = createLookupGenerationString(sessionKey, rules)
    header_splunk={'content-type': "application/x-www-form-urlencoded", "Authorization": "Basic %s" % sessionKey, 'accept': "application/json"}
    params = {'output_mode': 'json', 'search':searchString}
    search_url = 'https://localhost:8089/servicesNS/nobody/DA-ESS-MitreContent/search/jobs/export'
    response = requests.request('GET', search_url, headers=header_splunk, params=params, verify=False)
    return response.text

sessionKey = getSessionKey()
#sessionKey = 'YWRtaW46YjEyMzQ1Njc='
api_rules = getRulesFromApi(sessionKey)
splunk_rules = getSavedSearches(sessionKey)

#api_rule_names = [i['rule_name'] for i in api_rules ]
splunk_rule_names = [i['name'] for i in splunk_rules['entry']]

for api_rule in api_rules:
    if api_rule['rule_name'] not in splunk_rule_names :
        addSavedSearch(sessionKey, api_rule['rule_name'], api_rule['spl'], api_rule['technique_id'])

createLookup(sessionKey, api_rules)
