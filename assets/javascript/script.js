// Initialize Firebase
const config = {
    apiKey: "AIzaSyBFJGryuBgQJbDvpz1zUa2rHanCbKda7pw",
    authDomain: "trainscheduler-d760f.firebaseapp.com",
    databaseURL: "https://trainscheduler-d760f.firebaseio.com",
    projectId: "trainscheduler-d760f",
    storageBucket: "trainscheduler-d760f.appspot.com",
    messagingSenderId: "410217850048"
  };
  firebase.initializeApp(config);

const trainScheduler = {
    database: firebase.database(),
    addTrain: function(event) {
        event.preventDefault();
        const trainName = $('#train-name').val().trim();
        const destination = $('#destination').val().trim();
        const frequencyMin = $('#frequency').val().trim();
        const trainTime = $('#train-time').val().trim();

        this.database.ref().push({
            trainName: trainName,
            destination: destination,
            frequencyMin: frequencyMin,
            trainTime: trainTime
        });
        $('#train-name, #destination, #frequency, #train-time').val('');
    },
    minutesTillTrain: function(firstTrainTime, frequency) {
        const formattedTime = moment(firstTrainTime, 'HH:mm').subtract(1, 'day');
        const diffTime = moment().diff(moment(formattedTime), 'minutes');
        const timeRemainder = diffTime % frequency;
        const minutesTillTrain = frequency - timeRemainder;
        return(minutesTillTrain);
    },
    nextTrainTime: function(minutesTillTrain) {
        const nextTrain = moment().add(minutesTillTrain, 'minutes');
        return(nextTrain);
    }
};



$(document).ready(function() {
    $('#submit-button').on('click', trainScheduler.addTrain.bind(trainScheduler));
    trainScheduler.database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        const minutesTill = trainScheduler.minutesTillTrain(childSnapshot.val().trainTime, childSnapshot.val().frequencyMin);
        const nextTrain = trainScheduler.nextTrainTime(minutesTill);

        const newRow = $('<tr>')
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