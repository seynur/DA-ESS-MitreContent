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
            var value = cell.value;
            spl_string = value.split("|")[0];
            spl_value = value.split("|")[1];
            spl_maxurgency = value.split("|")[3];
            var urgency = "None";

            if (spl_maxurgency==1){
                urgency = "INFO";
            }
            else if (spl_maxurgency==2){
                urgency = "Low";
            }
            else if (spl_maxurgency==3){
                urgency = "Medium";
            }
            else if (spl_maxurgency==4){
                urgency = "High";
            }
            else if (spl_maxurgency==5){
                urgency = "Critical";
            }

            ttl = "Found " + spl_value + " attacks.\nUrgency: " + urgency;
            $td.tooltip();
            $td.prop('title', ttl);
            
            if (spl_value != "NULL") {
                if(spl_maxurgency >= 5){
                    $td.addClass('range-cell').addClass('range-crit');
                }
                if(spl_maxurgency == 4){
                    $td.addClass('range-cell').addClass('range-high');
                }
		        if(spl_maxurgency == 3){
                    $td.addClass('range-cell').addClass('range-med');
                }
                if(spl_maxurgency == 2){
                    $td.addClass('range-cell').addClass('range-low');
                }
                if(spl_maxurgency == 1){
                    $td.addClass('range-cell').addClass('range-info');
                }
            }

            if (isDarkTheme) {
              $td.addClass('dark');
            }

            // Update the cell content
            //$td.text(value.toFixed(2)).addClass('numeric');
            
            $td.text(value);

            if (spl_string==="NULL"){
                $td.addClass('range-cell').addClass('range-nonexistent');
                $td.text(" ");
            }
            else {
                $td.text(spl_string);
                $td.addClass('add-border').addClass('text-align-center');
            }
        }
    });

    mvc.Components.get('highlight').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});
