---
layout: default
title: Overview
---

### Overview
This application provides compliance and triage dashboards for MITRE ATT&CK Framework with drill-down capabilities. It is recommended to utilize [Splunk Enterprise Security](https://splunkbase.splunk.com/app/263/) and [Splunk ES Content Update] (https://splunkbase.splunk.com/app/3449/); however, starting with version 2.3.0 non-ES deployments are also supported with [Alert Manager] (https://splunkbase.splunk.com/app/2665/) integration.

#### Required Splunk Apps:
Starting with version 2.3.0, we added support for non-ES (Enterprise Security App) deployments as well.

One of the following applications is required:
- [Splunk Enterprise Security](https://splunkbase.splunk.com/app/263/) 5.2 or above 

    _OR_
- [Alert Manager](https://splunkbase.splunk.com/app/2665/)

For one of the views:
- [Sankey Diagram - Custom Visualization](https://splunkbase.splunk.com/app/3112/)


#### Recommended Splunk Apps:
- [Splunk ES Content Update](https://splunkbase.splunk.com/app/3449/) 1.0.40 or above
- [Lookup File Editor](https://splunkbase.splunk.com/app/1724/)

__Note__: Although the app will work without ES Content Update, it is highly recommended since it comes with many correlation rules that have mitre_attack annotations already.

### Saved Searches
This application comes with predefined saved searches.  Lookup Gen searches are scheduled to run  daily after midnight.
* **MITRE ATT&CK All Rules and Techniques Lookup Gen**: This lookup generator checks currently enabled correlation rules via analytic stories and combines the searches with user-defined ``mitre_user_rule_technique_lookup.csv** file that matches MITRE ATT&CK technique IDs with rules.
* **MITRE ATT&CK Compliance Lookup Gen**: This lookup generator relies on ``mitre_all_rule_technique_lookup.csv`` in order to generate a new lookup to properly display MITRE ATT&CK Compliance martix.
