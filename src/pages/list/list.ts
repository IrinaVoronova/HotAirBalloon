import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  nativepath:string = localStorage.getItem('nameSong');
  value:number = +localStorage.getItem('inputCycle');
  checked:boolean= !!(+localStorage.getItem('vibrate'));


constructor( public navCtrl: NavController, public params:NavParams,private fileChooser: FileChooser) { }


/*получаем доступ к файлам и берем путь к выбраному файлу и сохраняем его в localStorage*/

filechooser() {
 this.fileChooser.open()
  .then(uri => {
    (<any>window).FilePath.resolveNativePath(uri, (result) => {
      let path = result;
      localStorage.setItem('music',path);

/*берем название файла с адресной строки*/
      let find = '/';
      let pos = -1;
      let AllFindPos = [];
      while ((pos = path.indexOf(find, pos + 1)) != -1) {
         AllFindPos.push(pos);
      }
      let maxPos = Math.max.apply(null, AllFindPos);
      let nameFile:string = path.substring(maxPos+1);
      localStorage.setItem('nameSong',nameFile);
      this.nativepath = nameFile;
    }, (err) => {
          alert(err);
        });
  }).catch(e => console.log(e));
  console.log(this.checked);

}

cycles(){
  let countSave = localStorage.setItem('inputCycle', this.value + " ");//для хранения изначального значения
      localStorage.setItem('countCycles', this.value + " "); // для запуска таймера и изменения значения

}

vibratioOnOff(){
if(this.checked === true ) {

  localStorage.setItem('vibrate','1');
}else if(this.checked === false){

localStorage.setItem('vibrate','0');
}
}
}
