import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {PTimer} from "./PTimer";
import { MediaPlugin, MediaObject} from '@ionic-native/media';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Vibration } from '@ionic-native/vibration';


@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})

export class TimerComponent{
 private timeInSeconds: number;
 public timer: PTimer;
        file;
 constructor(private vibration: Vibration, public navCtrl: NavController, private fileChooser: FileChooser, private filePath: FilePath, private media: MediaPlugin) {

}

audioPlay() {
  this.timer.hasFinished = true;
  /*берем адрес файла с localStorage и воспроизводим мелодию по окончанию таймера*/
  const onStatusUpdate = (status) => console.log(status);
  const onSuccess = () => console.log('Action is successful.');
  const onError = (error) => console.error(error.message);
  let pathalone = localStorage.getItem('music').substring(8);
  this.file = this.media.create(pathalone, onStatusUpdate, onSuccess, onError );
  this.file.play();

}
/*функция запускаеться при нажатии на кнопку refresh и при остановке таймера*/
audioStop() {
  this.file.stop();
}

audioPause(){

this.file.getCurrentPosition().then((position) => {
  console.log(position);
});
}


ngOnInit() {
  this.initTimer();
}

hasFinished() {
  return this.timer.hasFinished;
}

 pauseTimer() {
   this.timer.runTimer = false;
 }

 resumeTimer() {
  this.startTimer();
}


 initTimer() {

 if (!this.timeInSeconds) {
   this.timeInSeconds = 10;
 } // тут меняем стартовое время (500 = 20 мин.)
    this.timer = <PTimer>{
     time: this.timeInSeconds,
     runTimer: false,
     hasStarted: false,
     hasFinished: false,
     timeRemaining: this.timeInSeconds
 };
 this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timeRemaining);
 }

 getSecondsAsDigitalClock(inputSeconds: number) {
   let sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
   let hours = Math.floor(sec_num / 3600);
   let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
   let seconds = sec_num - (hours * 3600) - (minutes * 60);
   let hoursString = '';
   let minutesString = '';
   let secondsString = '';
       hoursString = (hours < 10) ? "0" + hours : hours.toString();
       minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
       secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
   return hoursString + ':' + minutesString + ':' + secondsString;
 }

 startTimer() {
   this.initTimer();
   let countRunCycles = +localStorage.getItem('countCycles');
       localStorage.setItem('countCycles', '' + --countRunCycles);

   if(countRunCycles>=0){
     this.timer.hasStarted = true;
     this.timer.runTimer = true;
     this.timerTick();
   }else{
     let firstCount= localStorage.getItem('inputCycle');
         this.timer.hasFinished = true;
         localStorage.setItem('countCycles', firstCount);
       }

 }

 timerTick() {

     setTimeout(() => {

       if (!this.timer.runTimer) { return; }
         this.timer.timeRemaining--;
         this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timeRemaining);
           if (this.timer.timeRemaining > 0) {
             this.timerTick();
           }
           else {
             this.audioPlay();
             if(+localStorage.getItem('vibrate')=== 1){
             this.vibration.vibrate([4000,2000,4000,2000,4000,2000,4000,2000,4000]);
           }
             setTimeout(()=>{
               this.vibration.vibrate(0);
               this.startTimer();
               this.audioStop()
             },30000)// останавливаем проигрывание мелодии через две минуты
           }

     }, 1000);

  }
}
