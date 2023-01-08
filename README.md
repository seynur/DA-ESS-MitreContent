## MITRE ATT&CK App for Splunk&reg;

#### Documentation
Detailed documentation can be found at: https://seynur.github.io/DA-ESS-MitreContent/

#### Overview
This application provides compliance and triage dashboards for MITRE ATT&CK Framework with drill-down capabilities. It is recommended to utilize Splunk Enterprise Security(https://splunkbase.splunk.com/app/263/) and Splunk ES Content Update (https://splunkbase.splunk.com/app/3449/); however, starting with version 2.3.0 non-ES deployments are also supported with Alert Manager (https://splunkbase.splunk.com/app/2665/) integration.

#### Required Splunk Apps:
Starting with version 2.3.0, we added support for non-ES (Enterprise Security App) deployments as well.

One of the following applications is required:
- Splunk Enterprise Security 5.2 or above (https://splunkbase.splunk.com/app/263/)

    _OR_
- Alert Manager (https://splunkbase.splunk.com/app/2665/)

For one of the views:
- Sankey Diagram - Custom Visualization (https://splunkbase.splunk.com/app/3112/)


#### Recommended Splunk Apps:
- Splunk ES Content Update 1.0.40 or above (https://splunkbase.splunk.com/app/3449/)
- Lookup File Editor (https://splunkbase.splunk.com/app/1724/)

__Note__: Although the app will work without ES Content Update, it is highly recommended since it comes with many correlation rules that have mitre_attack annotations already.

#### Setup Instructions
After installation of the application you will be on Setup page.  Review your desired configuration for scheduled searches and simply hit Save to continue.  Default view will be the Compliance Dashboard.  If the matrix is not populated, click on the table to run manually, which will direct you to the Lookup Generation dashboard (searches run automatically on that dashboard).

__Note__: If using Alert Manager app, you will need to uncheck ```Use Enterprise Security App``` checkbox within __Setup__ view.

#### Saved Searches
This application comes with predefined saved searches.  Lookup Gen searches are scheduled to run  daily after midnight.  The main ones that are used by views:
- ```MITRE ATT&CK All Rules and Techniques Lookup Gen```: This lookup generator checks currently enabled correlation rules via analytic stories and combines the searches with user-defined mitre_user_rule_technique_lookup.csv file that matches MITRE ATT&CK technique IDs with rules.
- ```MITRE ATT&CK Compliance Lookup Gen```: This lookup generator relies on mitre_all_rule_technique_lookup.csv in order to generate a new lookup to properly display MITRE ATT&CK Compliance martix.


#### Release Notes:
Version 3.8.0
- Date: 6 Jan 2023
- Feature: Updated search macros and views to include MITRE ATT&CK annotations dynamically.

Version 3.7.0
- Date: 2 Nov 2022
- Feature: Compatibility with ATT&CK version 12.0

Version 3.6.0
- Date: 15 Jun 2022
- Feature: Compatibility with ATT&CK version 11.2

Version 3.5.0
- Date: 05 Nov 2021
- Feature: Compatibility with ATT&CK version 10.0

Version 3.4.0
- Date: 29 Jul 2021
- Feature: API integration is replaced with out-of-the-box rules.
 - Removed custom search command ```getattackdetectionrules```
 - Changed setup view
 - Added 65 new rules (optimized to use Data Models) from MITRE Cyber Analytics Repository (car.mitre.org)
 - Added ```mitre_app_rule_technique_lookup```
 - Removed ```mitre_api_rule_technique_lookup```

Version 3.3.0
- Date: 26 May 2021
- Feature: Updated jQuery to version 3.6.0
- Feature: Added new Rule Display Option to the MITRE ATT&CK Compliance dashboard to show all existing rules or only enabled rules

Version 3.2.0
- Date: 4 May 2021
- Feature: Compatibility with ATT&CK version 9.0
  - Updated lookup tables with technique and sub-technique IDs

Version 3.1.1
- Date: 14 Apr 2021
- Feature: Splunk Enterprise Security 6.4.x provides mitre_attack annotation in correlation searches that map to techniques. These mappings are integrated into both the Compliance and Triggered Techniques dashboards.
- Bug fix: MITRE ATT&CK Matrix search macro issue is fixed for deployments with Enterprise Security.

Version 3.1.0
- Date: 29 Mar 2021
- Feature: Updated default rule lookup with Enterprise Security 6.4.1 and ES Content Update 3.17.0
- Feature: API v2 endpoint integration with HMAC-SHA512 authentication
- Documentation updates and corrections

Version 3.0.3
- Date: 25 Mar 2021
- Bug fix: ES Content Update mitre_attack annotation provides Technique IDs instead of names with newer versions. This fix is compatible with both name and/or ID representation of annotations to build compliance dashboard.

Version 3.0.2
- Date: 20 Mar 2021
- Bug fix: Drill-down functionality on MITRE ATT&CK Matrix is passing wrong argument

Version 3.0.1
- Date: 08 Jan 2021
- Bug fix: mitre_user_rule_technique_lookup.csv overwrites existing lookup during upgrades
- Bug fix: Missing mitre_api_rule_technique_lookup causes issues on fresh/new installations
- Bug fix: Missing sub-techniques in ATTACK version 8.1

Version 3.0.0
- Date: 29 Nov 2020
- Feature: Compatibility with ATT&CK version 8.1
  - Updated lookup tables with technique and sub-technique IDs
  - Updated lookup table generator search
  - Updated matrix views to reflect sub-techniques

Version 2.4.0
- Date: 30 Oct 2020
- Feature: New setup view to be compatible with Splunk Cloud
  - Setup.xml replaced by custom javascript.  
- Bug fix: Alert Manager 3.0.4 compatibility issues

Version 2.3.0
- Date: 22 Jun 2020
- Feature: Option to work with plain Splunk Enterprise (no ES requirement)
  - Added macros for flexible deployment option (default is ES app)
  - Updated views to use the macros

Version 2.2.1
  - Date: 22 Jun 2020
  - Bug fix: Removed unused inputs.conf to avoid any confusion.

Version 2.2.0
- Date: 09 May 2020
- Bug fix: Duplication issue for Rule Finder
- Feature: Added option to display compliance matrix without default rules (user-defined/API rules only)
  - Added lookup file definitions
  - Added default rules lookup files for ES 6.1.1 and ESCU 1.0.53 out-of-the-box rules
  - Updated Lookup Generation view
- Feature: Setup.xml for API integration for continuous new rule updates (free service but requires registration)
  - Added custom search command (| getattackdetectionrules)


Version 2.1.0
- Date: 25 Feb 2020
- Added a new view for mapping rules to Techniques
- Updated lookup tables and some searches accordingly

Version 2.0.1
- Date: 12 Feb 2020
- Bug fix for appinspect validation
- Tactics overview displayed as table with updated js and css

Version 2.0.0
- Date: 08 Feb 2020
- Updated lookup tables to correctly define MITRE ATT&CK tactics and techniques
- Introduced a new macro to utilize technique and tactic IDs/names
- Updated dashboards to utilize new lookup table and macro
- Performance improvements
- Updated CSS and JS files
- Introduced a setup view for ease of initial lookup generation

Version 1.3.0
- Date: 09 Jan 2020
- Updated ATT&CK Matrix dashboard
- Added new dashboard for detailed view of triggered rules by notable assets and tactics/techniques
- Improved search performance and dependency on lookups
- Added a new lookup to match correlation rules to MITRE ATT&CK tactics/techniques

Version 1.2.1
- Date: 24 Oct 2019
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
