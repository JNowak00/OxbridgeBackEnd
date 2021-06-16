import schedule from 'node-schedule';


const date = new Date(2021, 5, 16, 10, 4-3, 0);

const job = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});