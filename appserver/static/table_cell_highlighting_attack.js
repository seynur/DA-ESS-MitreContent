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
            return _(['active_hist_searches', 'active_realtime_searches',"Collection","Command And Control","Credential Access","Defense Evasion","Discovery","Execution","Exfiltration","Impact","Initial Access","Lateral Movement","Persistence","Privilege Escalation"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value = cell.value;
            spl_string = value.split("|")[0];
            spl_value = value.split("|")[1];
            
        


            //spl_total = value.split("|")[2];
            //spl_enabled = value.split("|")[3];
            
            //ttl = "Enabled: " + spl_total + "\nTotal: " + spl_enabled + "\nPercentage: " + spl_value;
            ttl = "Found " + spl_value + " attacks."
            $td.tooltip();
            $td.prop('title', ttl);

            //fields = ["Collection","Command And Control","Credential Access","Defense Evasion","Discovery","Execution","Exfiltration","Impact","Initial Access","Lateral Movement","Persistence","Privilege Escalation"]
            
            if (spl_value != "NULL") {
                spl_value =  parseFloat(spl_value);
                if(spl_value >= 4){
                    $td.addClass('range-cell').addClass('range-all');
                }
                if(spl_value == 3){
                    $td.addClass('range-cell').addClass('range-high');
                }
		        if(spl_value == 2){
                    $td.addClass('range-cell').addClass('range-mid');
                }
                if(spl_value ==1){
                    $td.addClass('range-cell').addClass('range-low');
                }
                if(spl_value == 0){
                    $td.addClass('range-cell').addClass('range-existbutzero');
                }
                
            }
            else if(spl_value === "NULL"){
                $td.addClass('range-cell').addClass('range-nonexistent');
            }


            if (isDarkTheme) {
              $td.addClass('dark');
            }

            // Update the cell content
            //$td.text(value.toFixed(2)).addClass('numeric');
            

            $td.text(value);

            if (spl_string==="NULL"){
                $td.text(" ");
            }
            else {
                $td.text(spl_string);
            }
        }
    });

    mvc.Components.get('highlight').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});
