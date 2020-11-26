/* TODO: jink to replace theme_utils with that from core */
require.config({
  paths: {
    theme_utils: '../app/DA-ESS-MitreContent/theme_utils'
  }
});


require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'theme_utils',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView, themeUtils) {

     // Row Coloring Example with custom, client-side range interpretation

    var isDarkTheme = themeUtils.getCurrentTheme && themeUtils.getCurrentTheme() === 'dark';

    var MitreMatrixRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
	    return _(["Reconnaissance", "Resource Development", "Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Command and Control", "Exfiltration", "Impact"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            var technique_id = value_arr[0];
            var technique_name = value_arr[1];
            var triggered_count = value_arr[2];
            var rule_name = value_arr[3];
            var max_urgency = value_arr[4];
	    var urgency_str = "None"
      if(technique_id.includes('.')) {
		$td.addClass('subtechnique');
	    }
      else {
        if(technique_name=="NULL"){
          $td.addClass('empty');
        }
        else {
          $td.addClass('technique');
        }
      }

	    if (max_urgency==1){
                urgency_str = "Info";
		$td.addClass('range-cell').addClass('range-info');
            }
            else if (max_urgency==2){
                urgency_str = "Low";
		$td.addClass('range-cell').addClass('range-low');
            }
            else if (max_urgency==3){
                urgency_str = "Medium";
		$td.addClass('range-cell').addClass('range-med');
            }
            else if (max_urgency==4){
                urgency_str = "High";
		$td.addClass('range-cell').addClass('range-high');
            }
            else if (max_urgency==5){
                urgency_str = "Critical";
		$td.addClass('range-cell').addClass('range-crit');
            }
	    else {
		$td.addClass('range-cell').addClass('range-none-matrix');
	    }

            ttl = "Found " + triggered_count + " attacks.\nUrgency: " + urgency_str;
            $td.tooltip();
            $td.prop('title', ttl);


            if (isDarkTheme) {
              $td.addClass('dark');
            }

            if (technique_name=="NULL"){
                $td.text(" ");
            }
            else {
                $td.text(technique_id + ": " + technique_name);
                $td.addClass('add-border').addClass('text-align-center');

        }
        }
    });

    var MitreTitleRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
	    return _(["Reconnaissance", "Resource Development", "Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Command and Control", "Exfiltration", "Impact"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            triggered_count = value_arr[0];
            max_urgency = value_arr[1];

            $td.addClass('add-border').addClass('text-align-center');

	    if (max_urgency==1){
		$td.addClass('title-range-cell').addClass('title-range-info');
            }
            else if (max_urgency==2){
		$td.addClass('title-range-cell').addClass('title-range-low');
            }
            else if (max_urgency==3){
		$td.addClass('title-range-cell').addClass('title-range-med');
            }
            else if (max_urgency==4){
		$td.addClass('title-range-cell').addClass('title-range-high');
            }
            else if (max_urgency==5){
		$td.addClass('title-range-cell').addClass('title-range-crit');
            }
	    else {
		$td.addClass('title-range-cell').addClass('title-range-none');
	    }

            if (isDarkTheme) {
              $td.addClass('dark');
            }

            // Update the cell content
            //$td.text(value.toFixed(2)).addClass('numeric');

            if (triggered_count=="NULL"){
                $td.text("0");
            }
            else {
                $td.text(triggered_count);
            }
        }
    });

    mvc.Components.get('mitrematrix').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new MitreMatrixRenderer());
    });

    mvc.Components.get('mitretitle').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new MitreTitleRenderer());
    });

});
