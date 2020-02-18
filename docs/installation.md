---
layout: default
title: Installation
---

### Installation
1. Download the latest AppInspect Passed version from: [https://splunkbase.splunk.com/app/4617/](https://splunkbase.splunk.com/app/4617/)

   Please visit the Github repo for the latest changes and development efforts: [https://github.com/seynur/DA-ESS-MitreContent/](https://github.com/seynur/DA-ESS-MitreContent/)
2. Install the application on Splunk Enterprise.  This application (DA-ESS-MitreContent) should be installed on the _Search Head_ or _Search Head Cluster_ where Enterprise Security Application resides.
  For details on add-on installation please refer to [Splunk Documentation](https://docs.splunk.com/Documentation/AddOns/released/Overview/Installingadd-ons)


### Initial Setup
Upon initial installation you will be on Compliance Dashboard.  If the matrix is not populated, click on the table row to run manually, which will direct you to the Setup dashboard (searches run automatically on that dashboard).

1. Click on the table row.

   ![setup1]

   &nbsp;

2. This setup page will run lookup generating searches for the initial usage. These reports are scheduled to run daily at midnight in order to populate/update the lookup tables for enabled correlation rules pertinent to MITRE ATT&CK Framework.

   ![setup2]

   &nbsp;

3. Wait for the initial search to complete for MITRE ATT&CK All Rules and Techniques Lookup.  Depending on your environment you may get an error for MITRE ATT&CK Compliance Lookup.  No worries, wait for 15 seconds for it to refresh; this search depends on the first one.

   ![setup3]

   &nbsp;

4. Once the search is completed, you can go back to "MITRE ATT&CK Compliance with Splunk ES" dashboard to view the level of existing rules (enabled and available) in comparison to MITRE ATT&CK techniques. You can click on a specific technique in order to view the associated correlation rules within ES App.

   ![setup4]

   &nbsp;

5. MITRE ATT&CK Rule Finder view enables users to search for existing correlation rules based on technique names.  You can click on the desired rule for further configuration.

   ![setup5]

   &nbsp;

   ![setup6]

   &nbsp;




[logo]: assets/img/seynur_logo_dark.png
[setup1]: assets/img/setup1.png
[setup2]: assets/img/setup2.png
[setup3]: assets/img/setup3.png
[setup4]: assets/img/setup4.png
[setup5]: assets/img/setup5.png
[setup6]: assets/img/setup6.png
