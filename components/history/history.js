/* global angular */
/* global Firebase */

var historyModule = angular.module('bplogger.history', ["firebase", "googlechart","ngRoute"]);

historyModule.value('googleChartApiConfig', {
    version: '1',
    optionalSettings: {
        packages: ['corechart'],
        language: 'es'
    }
});

historyModule.value('configuration', {
    bp: {
        type: "LineChart",
        options: {
            curveType: 'function',
            title: 'Blood pressure',
            explorer: {
                axis: 'horizontal',
                keepInBounds: true
            },
            trendlines: {
              0: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
                },
              1: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
              },
              2: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
              }
            },
            height: '100%',
            width: '100%'
        },
        columns: [0,1,2,3]
    },
    hr: {
        type: "ScatterChart",
        options: {
            title: 'Pulse',
            explorer: {
                axis: 'horizontal',
                keepInBounds: true
            },
            trendlines: {
                0: {
                    type: 'polynomial',
                    opacity: 0.3,
                    visibleInLegend: false,
                    degree: 12
                }
            },
            theme: 'maximized',
            height: '100%',
            width: '100%'
        },        
        columns: [0, 4]
    },
    bp7: {
        type: "LineChart",
        options: {
            curveType: 'function',
            title: 'Blood pressure',
            explorer: {
                axis: 'horizontal',
                keepInBounds: true
            },
            trendlines: {
              0: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
                },
              1: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
              },
              2: {
                type: 'polynomial',
                opacity: 0.3,            
                visibleInLegend: false,
                degree: 12
              }
            },
            height: '100%',
            width: '100%'
        },
        columns: [0, 1, 2, 3],
        filters: [
            {
                column: 0,
                minValue: moment().subtract(7,'days').toDate()
            }
        ]
    },
    sysdist: {
        type: "ScatterChart",
        options: {
            title: 'Systolic distribution',
            explorer: {
                axis: 'horizontal',
                keepInBounds: true
            },
            trendlines: {
                0: {
                    type: 'polynomial',
                    opacity: 0.3,
                    visibleInLegend: false,
                    degree: 12
                }
            },
            height: '100%',
            width: '100%'
        },
        columns: [5, 1]
    },
    bpdist: {
        type: "ScatterChart",
        options: {
            title: 'Blood pressure distribution',
            explorer: {
                axis: 'horizontal',
                keepInBounds: true
            },
            trendlines: {
                0: {
                    type: 'polynomial',
                    opacity: 0.3,
                    visibleInLegend: false,
                    degree: 12
                },
                1: {
                    type: 'polynomial',
                    opacity: 0.3,
                    visibleInLegend: false,
                    degree: 12
                }
            },
            height: '100%',
            width: '100%'
        },
        columns: [5, 1 , 2]
    },
});

historyModule.controller('HistoryController', ["measurements","$routeParams","googleChartApiPromise","configuration", HistoryController]);

function HistoryController(measurements,$routeParams,googleChartApiPromise,configuration) {
    var self = this;
    
    googleChartApiPromise.then(function () { 
        self.graphType = $routeParams.historyType;
        
        self.chartObject = {};    
        
        self.chartObject.data = {};
        self.chartObject.type = configuration[self.graphType].type;
        self.chartObject.options = configuration[self.graphType].options;
    
        var dataTable = new google.visualization.DataTable({
            "cols": [
                {id: "t", label: "Time", type: "datetime"},
                { id: "sys", label: "Systolic", type: "number" },
                { id: "dia", label: "Diastolic", type: "number" },
                { id: "mean", label: "Mean", type: "number" },
                { id: "hr", label: "Pulse", type: "number" },
                { id: "td", label: "Time of Day", type: "timeofday" }         
            ],
            "rows": []
        });
        
        self.chartObject.data = new google.visualization.DataView(dataTable);
        self.chartObject.data.setColumns(configuration[self.graphType].columns);        
        
        function toTimeOfDay(value) {
            var m = moment(value);
            return [m.hours(), m.minutes(), m.seconds()];
        }
        
        measurements.$loaded().then(function (value) {
            value.forEach(function (element) {
                dataTable.addRow([new Date(element.timestamp), element.sys, element.dia, element.mean, element.hr, toTimeOfDay(element.timestamp)]);
            }, this);
            
            if (configuration[self.graphType].filters) {
                self.chartObject.data.setRows(dataTable.getFilteredRows(configuration[self.graphType].filters));
            }
        }); 
    });              
}

