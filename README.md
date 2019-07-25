## DA-ESS-MitreContent

#### Overview
This application provides compliance and triage dashboards for MITRE ATT&CK Framework that are fully integrated with Splunk Enterprise Security(https://splunkbase.splunk.com/app/263/) and Splunk ES Content Update (https://splunkbase.splunk.com/app/3449/) with drill-down capabilities.

#### Prerequisites:
Splunk Enterprise 7.x or above
Splunk Enterprise Security 5.2 or above
Splunk ES Content Update 1.0.40 or above

#### Setup Instructions
Upon initial installation you may need to manually run "MITRE Compliance Lookup Gen" saved search/report in order to populate the lookup table.

#### Saved Searches
This application comes with a predefined saved search (MITRE Compliance Lookup Gen) which checks currently enabled correlation rules via analytic stories and creates a lookup file to match them to MITRE ATT&CK Framework techniques for compliance.  By default this search is scheduled to run at midnight everyday to populate the lookup table.

#### Release Notes:
Version 1.1.0
- Bug fixes & typos
- Added descriptions to dashboards

Version 1.0.0
- Initial version for Splunkbase
- Test to run on 7.3.0 and ES App 5.3


#### Support
Contact information for reporting an issue: development@seynur.com
For latest fixes/changes: https://github.com/seynur/DA-ESS-MitreContent 
