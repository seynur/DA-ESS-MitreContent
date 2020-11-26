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
            //return _(["Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Command and Control", "Exfiltration", "Impact", "TA0001:Initial Access", "TA0002:Execution", "TA0003:Persistence", "TA0004:Privilege Escalation", "TA0005:Defense Evasion", "TA0006:Credential Access", "TA0007:Discovery", "TA0008:Lateral Movement", "TA0009:Collection", "TA0011:Command and Control", "TA0010:Exfiltration", "TA0040:Impact","TA0001","TA0002","TA0003","TA0004","TA0005","TA0006","TA0007","TA0008","TA0009","TA0011","TA0010","TA0040"]).contains(cell.field);
            return _(["Reconnaissance", "Resource Development", "Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Command and Control", "Exfiltration", "Impact"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            var technique_id = value_arr[0];
            var technique_name = value_arr[1];
            var percentage = value_arr[2];
            var enabled_count = value_arr[3];
            var total_count = value_arr[4];
            var urgency_str = "None"

            var ttl = "Total: " + total_count + "\nEnabled: " + enabled_count + "\nPercentage: " + percentage;

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
                $td.text(technique_id + ": " + technique_name);
                $td.addClass('add-border').addClass('text-align-center');

            }
        }
    });

    mvc.Components.get('mitrematrix').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});
