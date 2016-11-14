sentimentAnalysis.controller('startController', function($scope, $http, $state,  dataService) {
    var timer = setTimeout(function() {
            $state.go("input")
        }, 3000);
    
})

sentimentAnalysis.controller('homeController', function($scope, $http, $state,  dataService, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    $scope.tweetsData = [];
    $scope.sentimentData =[];
    $scope.positiveCount = 0;
    $scope.negativeCount = 0;
    $scope.neutralCount = 0;
    $scope.getTweetsData = function(tweetData){
    $scope.tweetsData = [];  
    $scope.positiveCount = 0;
    $scope.negativeCount = 0;
    $scope.neutralCount = 0;
        $http({
            method: 'GET',
            url : "data/dataCoordinates.json"
            }).success(function(data) {
                for(i=0;i<data.length;i++){
                        if(data[i].toLowerCase().indexOf(tweetData) >=0){
                            $scope.tweetsData.push(data[i]);
                        }
                    }
            }).then(function(obj) {
                for(var i=0;i<$scope.tweetsData.length;i++){
                    $scope.sentimentData($scope.tweetsData[i]);
                }       
            }) 
    }
    
    $scope.sentimentData= function(tweetsData){
        $scope.abcdef='';
        $http({
            method: 'GET',
            url : "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment"+
                            "?apikey=a0389e8e5281c2efd0f15cbd1ca236c6ff0caaad" +
                            "&outputMode=json&text="+tweetsData
            }).success(function(data) {
            if(data.docSentiment.type =='positive')
                $scope.positiveCount =$scope.positiveCount+1;
            else if(data.docSentiment.type =='negative')
                $scope.negativeCount=$scope.negativeCount+1;
            else if(data.docSentiment.type =='neutral')
                $scope.neutralCount=$scope.neutralCount+1;
            }).then(function(){
            $scope.generateGraph();
        })
    }
    
    $scope.generateGraph = function(){
        $state.go('result');
         Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Sentiment Analysis'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Tweets',
            colorByPoint: true,
            data: [{
                name: 'Positive',
                color:'yellow',
                y: $scope.positiveCount
            }, {
                name: 'Negative',
                color:'red',
                y: $scope.negativeCount,
                sliced: true,
                selected: true
            }, {
                name: 'Neutral',
                color:'green',
                y: 10.38
            }]
        }]
    });
    }
    $scope.getMapView = function(){
        $state.go('map');  
    }
})
sentimentAnalysis.controller('mapController', function($scope, $http, $state,  dataService, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
    $ionicPlatform.ready(function() {  
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
             
            var myLatlng = new google.maps.LatLng(lat, long);
             
            var mapOptions = {
                center: myLatlng,
                zoom: 2,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };          
             
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);  
            $scope.map = map;    
            var infowindow = new google.maps.InfoWindow();
            $http({
            method: 'GET',
            url : "data/dataCoordinates.json"
            }).success(function(data) {
                for(i=0;i<data.length;i++){
                    $scope.addMarkers(data[i]);
                }
            })
            
             
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
        $scope.addMarkers = function(data){
            var color='#ff0000';
            var tweetData;
            var latLng = new google.maps.LatLng(data.lat, data.lng);
            $http({
            method: 'GET',
            url : "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment"+
                            "?apikey=a0389e8e5281c2efd0f15cbd1ca236c6ff0caaad" +
                            "&outputMode=json&text="+data.text
            }).success(function(data) {
                tweetData = data;
                if(data.docSentiment.type =='positive'){
                    color="#ffff00";
                }
                else if(data.docSentiment.type =='negative'){
                    color:"#ff0000";
                }
                else if(data.docSentiment.type =='neutral'){
                    color="#00ff00";
                }
                else{
                   color:"#ff0000"; 
                }
             }).then(function(){
                 var marker = new google.maps.Marker({
                        map: $scope.map,
                        zoomControl: true,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: color,
                            strokeColor: color,
                        },
                        animation: google.maps.Animation.DROP,
                        position: latLng
                    }); 
                    var infoWindow = new google.maps.InfoWindow({
                        content: data.text
                    });
 
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });
            })         
        }
    }); 
    
});
