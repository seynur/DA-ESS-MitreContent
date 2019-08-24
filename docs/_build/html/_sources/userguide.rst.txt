.. _userguide:


**********
User Guide
**********

By default, this application comes with 2 views.

1. :ref:`MITRE ATT&CK Compliance with Splunk ES<compliance_view>`

2. :ref:`MITRE ATT&CK Framework Triggered Techniques<triggered_attacks_view>`

.. _compliance_view:

MITRE ATT&CK Compliance with Splunk ES
======================================


Each cell containing a technique is colored based on the percentage of enabled correlation searches.

If there isn't any related correlation searches, the cell is left uncolored.

If there are available correlation searches within Enterprise Security, then cells are colored based on percentage of enabled/active ones.

Currently the ranges are set as follows:

* low: 0-30% enabled
* medium: 30-50% enabled
* high: 70%+ enabled


You can mouse over to the cells that contain techniques in order to view the number of available and enabled correlation rules that are specific to that technique.
  .. image:: _static/mitreapp_setup3.png


.. _triggered_attacks_view:

MITRE ATT&CK Framework Triggered Techniques
===========================================

This dashboard/form has filtering options based on "**Event Time Range**" and "**Urgency**" level of Notable Events.  Currently following panels are available:

1. **Triggered Tactics**: Shows an overview of number of triggered Notable Events according to MITRE ATT&CK tactics.

2. **Techniques Triggered by Notable Assets**: Shows the number of triggered Notable Events according to MITRE ATT&CK techniques grouped by Notable Assets.  ``notable_asset`` is populated by ``src``, ``dest`` or ``user`` from related Data Models.

3. **MITRE ATT&CK Framework**: Provides a detailed match of triggered correlation searches with techniques and colored based on urgency level.

.. image:: _static/mitreapp_attack1.png
