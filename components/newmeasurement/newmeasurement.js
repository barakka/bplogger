/* global angular */
/* global Firebase */

angular.module('bplogger.newmeasurement', ["firebase"]).
controller('NewmeasurementController', ["$firebaseObject", "$firebaseArray", NewmeasurementController]);

function NewmeasurementController($firebaseObject, $firebaseArray) {
	var self = this;
	self.validator = /(\d{2,3})[\s-](\d{2,3})[\s-](\d{2,3})/; 
			
	self.newMeasurement = function () {
		self.measurement = "";
		self.timestamp = new Date();
	}
	
	self.saveMeasurement = function () {
		var text = self.measurement;
		console.log("Text:#" + text + "#");		
		var result = self.validator.exec(text);
		console.log(result);				
		if (result && result.length == 4) {
			self.current = {
				sys: parseInt(result[1]),
				dia: parseInt(result[2]),
				hr: parseInt(result[3]),
				mean: result[1]/3 + (result[2]*2)/3,
				timestamp: moment(self.timestamp).valueOf()
			}			
			
			$firebaseArray(ref.child("measurements")).$add(self.current).then(function (newValue) {
				console.log("Measurement added.");
				console.log(self.current);
				self.newMeasurement();
			});									
		}			
	}
	
	self.newMeasurement();
}