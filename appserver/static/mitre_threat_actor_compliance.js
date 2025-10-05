require.config({
  paths: {
    theme_utils: '../app/DA-ESS-MitreContent/theme_utils',
    jquery_local: '../app/DA-ESS-MitreContent/lib/js/jquery-3.6.0.min'
  }
});

require([
  'underscore',
  'jquery_local',
  'splunkjs/mvc',
  'splunkjs/mvc/tableview',
  'splunkjs/mvc/searchmanager',
  'theme_utils',
  'splunkjs/mvc/simplexml/ready!'
], function(_, jquery, mvc, TableView, SearchManager, themeUtils) {

  jQuery.noConflict();
  var $ = jQuery;

  var isDarkTheme = themeUtils.getCurrentTheme && themeUtils.getCurrentTheme() === 'dark';

  var dynamicFields = [];
  var fieldsLoaded = false;

  var fieldsSearch = new SearchManager({
    id: 'mitre-lookup-fields',
    search: [
      '| inputlookup mitre_threat_actor_lookup.csv',
      '| fieldsummary',        
      '| table field'        
    ].join(' ')
  });

  var tableViewRef = null;

  fieldsSearch.on('search:done', function () {
    var results = fieldsSearch.data('results');
    results.on('data', function () {
      if (!results.hasData()) return;
      dynamicFields = results.data().rows.map(function (row) { return row[0]; });
      
      dynamicFields = dynamicFields.filter(function (f) { return f && !['_time','_raw'].includes(f); });
      fieldsLoaded = true;
      if (tableViewRef) tableViewRef.render();
    });
  });

  var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
    canRender: function (cell) {

      if (!fieldsLoaded) return false;
 
      return _(dynamicFields).contains(cell.field);
    },
    render: function ($td, cell) {
      var value_arr = String(cell.value || '').split('|');
      var technique_id   = value_arr[0];
      var technique_name = value_arr[1];
      var percentage     = value_arr[2];
      var enabled_count  = value_arr[3];
      var total_count    = value_arr[4];

      var ttl = 'Total: ' + total_count + '\nEnabled: ' + enabled_count + '\nPercentage: ' + percentage;

      if (technique_id && technique_id.indexOf('.') !== -1) {
        $td.addClass('subtechnique');
      } else {
        if (technique_name === 'NULL') $td.addClass('empty');
        else $td.addClass('technique');
      }

      $td.tooltip();
      $td.prop('title', ttl);

      if (percentage !== 'NULL' && percentage !== undefined) {
        var p = parseFloat(percentage);
        if (!isNaN(p)) {
          if (p > 70)  $td.addClass('range-cell').addClass('range-compliance_high');
          if (p > 50)  $td.addClass('range-cell').addClass('range-compliance_mid');
          if (p > 30)  $td.addClass('range-cell').addClass('range-compliance_low');
          if (p >= 0)  $td.addClass('range-cell').addClass('range-compliance_zero');
        }
      } else {
        $td.addClass('range-cell').addClass('range-none');
      }

      if (isDarkTheme) $td.addClass('dark');

      if (technique_name === 'NULL') {
        $td.text(' ');
      } else {
        $td.text(technique_id + ': ' + technique_name)
           .addClass('add-border')
           .addClass('text-align-center');
      }
    }
  });

  mvc.Components.get('mitrematrix').getVisualization(function (tableView) {
    tableViewRef = tableView;
    tableView.addCellRenderer(new CustomRangeRenderer());
    if (fieldsLoaded) tableView.render();
  });

});