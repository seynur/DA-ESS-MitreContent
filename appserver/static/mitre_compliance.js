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
            return _(["Collection","Command And Control","Credential Access","Defense Evasion","Discovery","Execution","Exfiltration","Impact","Initial Access","Lateral Movement","Persistence","Privilege Escalation"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            technique_name = value_arr[0];
            percentage = value_arr[1];
            enabled_count = value_arr[2];
            total_count = value_arr[3];
            var urgency_str = "None"

            ttl = "Total: " + total_count + "\nEnabled: " + enabled_count + "\nPercentage: " + percentage;

            $td.tooltip();
            $td.prop('title', ttl);

            if (percentage != "NULL") {
                percentage =  parseFloat(percentage);
                if(percentage > 70){
                    $td.addClass('range-cell').addClass('range-compliance_high');
                }
	        if(percentage > 50){
                    $td.addClass('range-cell').addClass('range-compliance_mid');
                }
                if(percentage > 30){
                    $td.addClass('range-cell').addClass('range-compliance_low');
                }
                if(percentage >= 0){
                    $td.addClass('range-cell').addClass('range-compliance_zero');
                }

            }
            else if(percentage == "NULL"){
                $td.addClass('range-cell').addClass('range-none');
            }


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

    mvc.Components.get('mitrematrix').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});
