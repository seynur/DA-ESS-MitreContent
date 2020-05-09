---
layout: default
title: Overview
---

### Overview
This application ([https://splunkbase.splunk.com/app/4617/](https://splunkbase.splunk.com/app/4617/)) provides compliance and triage dashboards for MITRE ATT&CK Framework that are fully integrated with Splunk Enterprise Security ([https://splunkbase.splunk.com/app/263/](https://splunkbase.splunk.com/app/263/)) and Splunk ES Content Update ([https://splunkbase.splunk.com/app/3449/](https://splunkbase.splunk.com/app/3449/)) with drill-down capabilities.

### Required Splunk Apps:
* Splunk Enterprise Security 5.2 or above: [https://splunkbase.splunk.com/app/263/](https://splunkbase.splunk.com/app/263/)
* Sankey Diagram - Custom Visualization: [https://splunkbase.splunk.com/app/3112/](https://splunkbase.splunk.com/app/3112/)

### Recommended Splunk Apps:
* Splunk ES Content Update 1.0.40 or above: [https://splunkbase.splunk.com/app/3449/](https://splunkbase.splunk.com/app/3449/)
* Lookup File Editor: [https://splunkbase.splunk.com/app/1724/](https://splunkbase.splunk.com/app/1724/)

__Note__: Although the app will work without ES Content Update, it is highly recommended since it comes with many correlation rules that have mitre_attack annotations already.

### Saved Searches
This application comes with predefined saved searches.  Lookup Gen searches are scheduled to run  daily after midnight.
* **MITRE ATT&CK All Rules and Techniques Lookup Gen**: This lookup generator checks currently enabled correlation rules via analytic stories and combines the searches with user-defined ``mitre_user_rule_technique_lookup.csv** file that matches MITRE ATT&CK technique IDs with rules.
* **MITRE ATT&CK Compliance Lookup Gen**: This lookup generator relies on ``mitre_all_rule_technique_lookup.csv`` in order to generate a new lookup to properly display MITRE ATT&CK Compliance martix.
