// Initialize Firebase
var config = {
    apiKey: "AIzaSyBFJGryuBgQJbDvpz1zUa2rHanCbKda7pw",
    authDomain: "trainscheduler-d760f.firebaseapp.com",
    databaseURL: "https://trainscheduler-d760f.firebaseio.com",
    projectId: "trainscheduler-d760f",
    storageBucket: "trainscheduler-d760f.appspot.com",
    messagingSenderId: "410217850048"
  };
  firebase.initializeApp(config);

var trainScheduler = {
    database: firebase.database(),
    addTrain: function(event) {
        event.preventDefault();
        var trainName = $('#train-name').val().trim();
        var destination = $('#destination').val().trim();
        var frequencyMin = $('#frequency').val().trim();
        var trainTime = $('#train-time').val().trim();

        this.database.ref().push({
            trainName: trainName,
            destination: destination,
            frequencyMin: frequencyMin,
            trainTime: trainTime
        }).then(function(data) {
            console.log(data);
        });
    },
    minutesTillTrain: function(firstTrainTime, frequency) {
        let formattedTime = moment(firstTrainTime, 'HH:mm').subtract(1, 'day');
        let diffTime = moment().diff(moment(formattedTime), 'minutes');
        let timeRemainder = diffTime % frequency;
        var minutesTillTrain = frequency - timeRemainder;
        return(minutesTillTrain);
    },
    nextTrainTime: function(minutesTillTrain) {
        var nextTrain = moment().add(minutesTillTrain, 'minutes');
        return(nextTrain);
    }
};



$(document).ready(function() {
    $('#submit-button').on('click', trainScheduler.addTrain.bind(trainScheduler));
    trainScheduler.database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        let minutesTill = trainScheduler.minutesTillTrain(childSnapshot.val().trainTime, childSnapshot.val().frequencyMin);
        let nextTrain = trainScheduler.nextTrainTime(minutesTill);

        let newRow = $('<tr>')
        newRow.append(
            [$('<td>').text(childSnapshot.val().trainName),
            $('<td>').text(childSnapshot.val().destination),
            $('<td>').text(childSnapshot.val().frequencyMin),
            $('<td>').text(nextTrain.format('hh:mm')),
            $('<td>').text(minutesTill)]
        );
        $('#table-body').append(newRow);
    });
});