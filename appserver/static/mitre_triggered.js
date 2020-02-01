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

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
            return _(["Collection","Command And Control","Credential Access","Defense Evasion","Discovery","Execution","Exfiltration","Impact","Initial Access","Lateral Movement","Persistence","Privilege Escalation"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            technique_name = value_arr[0];
            triggered_count = value_arr[1];
            rule_name = value_arr[2];
            max_urgency = value_arr[3];
	    var urgency_str = "None"

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
		            $td.addClass('range-cell').addClass('range-none');
	          }

            ttl = "Found " + triggered_count + " attacks.\nUrgency: " + urgency_str;
            $td.tooltip();
            $td.prop('title', ttl);


            if (isDarkTheme) {
              $td.addClass('dark');
            }

            // Update the cell content
            //$td.text(value.toFixed(2)).addClass('numeric');

            if (technique_name=="NULL"){
                $td.text(" ");
            }
            else {
                $td.text(technique_name);
                $td.addClass('add-border').addClass('text-align-center');

        }
        }
    });

    mvc.Components.get('highlight').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});
