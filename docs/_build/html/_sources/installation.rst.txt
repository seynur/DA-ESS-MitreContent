.. _installation:


***************
Installation
***************

.. _getting_the_app:

Download and Install
====================

1. Download the latest AppInspect Passed version from: https://splunkbase.splunk.com/app/4617/
    For the latest changes and development efforts: https://github.com/seynur/DA-ESS-MitreContent/
2. Install the application on Splunk Enterprise.  DA-ESS-MitreContent should be installed on the Search Head or Search Head Cluster where Enterprise Security Application resides.
    For details on add-on installation please refer to Splunk Documentation: https://docs.splunk.com/Documentation/AddOns/released/Overview/Installingadd-ons

.. _initial_setup:

Initial Setup
=============

Upon installation of the add-on, you may need to initially run a search to populate the lookup table.  The report simply checks for available (and enabled) Correlation Searches that are tagged for MITRE ATT&CK techniques within the Analytic Stories.

1. First, please check the table at the top named "**MITRE ATT&CK Compliance Lookup Gen Status**" for lookup table status.

  .. image:: _static/mitreapp_setup1.png

2. Click on the row if the lookup table appears to be empty.  This will open a new windows with the "**Mitre Compliance Lookup Gen**" report.  By default this scheduled report runs daily, at 0:00. Its time range is last 24 hours.  Click **Open in Search** button to run this report for the first time.

  .. image:: _static/mitreapp_setup2.png

3. Once the search is completed, you can go back to "MITRE ATT&CK Compliance with Splunk ES" dashboard to view the level of existing rules (enabled and available) in comparison to MITRE ATT&CK techniques.

  .. image:: _static/mitreapp_setup3.png
