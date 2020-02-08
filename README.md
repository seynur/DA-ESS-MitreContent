## DA-ESS-MitreContent

#### Documentation
Detailed documentation can be found at: https://seynur.github.io/DA-ESS-MitreContent/

#### Overview
This application provides compliance and triage dashboards for MITRE ATT&CK Framework that are fully integrated with Splunk Enterprise Security(https://splunkbase.splunk.com/app/263/) and Splunk ES Content Update (https://splunkbase.splunk.com/app/3449/) with drill-down capabilities.

#### Required Splunk Apps:
Splunk Enterprise Security 5.2 or above (https://splunkbase.splunk.com/app/263/)
Sankey Diagram - Custom Visualization (https://splunkbase.splunk.com/app/3112/)

#### Recommended Splunk Apps:
Splunk ES Content Update 1.0.40 or above (https://splunkbase.splunk.com/app/3449/)
Lookup File Editor (https://splunkbase.splunk.com/app/1724/)

__Note__: Although the app will work without ES Content Update, it is highly recommended since it comes with many correlation rules that have mitre_attack annotations already.

#### Setup Instructions
Upon initial installation you will be on Compliance Dashboard.  If the matrix is not populated, click on the table to run manually, which will direct you to the Setup dashboard (searches run automatically on that dashboard).

#### Saved Searches
This application comes with predefined saved searches.  Lookup Gen searches are scheduled to run  daily after midnight.
MITRE ATT&CK All Rules and Techniques Lookup Gen: This lookup generator checks currently enabled correlation rules via analytic stories and combines the searches with user-defined mitre_user_rule_technique_lookup.csv file that matches MITRE ATT&CK technique IDs with rules.
MITRE ATT&CK Compliance Lookup Gen: This lookup generator relies on mitre_all_rule_technique_lookup.csv in order to generate a new lookup to properly display MITRE ATT&CK Compliance martix.


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
