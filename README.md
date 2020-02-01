## DA-ESS-MitreContent

#### Documentation
Detailed documentation can be found at: https://da-ess-mitrecontent.readthedocs.io

#### Overview
This application provides compliance and triage dashboards for MITRE ATT&CK Framework that are fully integrated with Splunk Enterprise Security(https://splunkbase.splunk.com/app/263/) and Splunk ES Content Update (https://splunkbase.splunk.com/app/3449/) with drill-down capabilities.

#### Prerequisites:
Splunk Enterprise Security 5.2 or above
Splunk ES Content Update 1.0.40 or above

#### Setup Instructions
Upon initial installation you may need to manually run "MITRE ATT&CK All Rules and Techniques Lookup Gen" saved search/report in order to populate the lookup table.

#### Saved Searches
This application comes with a predefined saved search (MITRE ATT&CK All Rules and Techniques Lookup Gen) which checks currently enabled correlation rules via analytic stories and creates a lookup file to match them to MITRE ATT&CK Framework techniques for compliance.  By default this search is scheduled to run at midnight everyday to populate the lookup table.

#### Release Notes:
Version 2.0.0
- Updated lookup tables to correctly define MITRE ATT&CK tactics and techniques
- Introduced a new macro to utilize technique and tactic IDs/names
- Updated dashboards to utilize new lookup table and macro 
- Performance improvements
- Updated CSS and JS files
- Introduced a setup view for ease of initial lookup generation

Version 1.3.0
- Updated ATT&CK Matrix dashboard
- Added new dashboard for detailed view of triggered rules by notable assets and tactics/techniques
- Improved search performance and dependency on lookups
- Added a new lookup to match correlation rules to MITRE ATT&CK tactics/techniques

Version 1.2.1
- Bug fixes with javascript table population
- Ordering of table fields to align with MITRE ATT&CK content

Version 1.2.0
- Date: 24 Aug 2019
- Bug fixes & typos
- Sphinx documentation is added

Version 1.1.0
- Date: 06 Aug 2019
- Bug fixes & typos
- Added descriptions to dashboards
- Added improvements for initial lookup generator

Version 1.0.0
- Date: 25 Jul 2019
- Initial version for Splunkbase
- Test to run on 7.3.0 and ES App 5.3


#### Support
Contact information for reporting an issue: development@seynur.com

For latest fixes/changes: https://github.com/seynur/DA-ESS-MitreContent
