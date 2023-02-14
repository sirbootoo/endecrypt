import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'
import * as fipamo from 'fipamo';
import * as fuctbase64 from 'fuctbase64';
import { saveAs } from 'file-saver';
import { toBase64String } from '@angular/compiler/src/output/source_map';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'enDecrypt';
  fileResult: any;
  enc: any;
  download: boolean = false;
  file: any;
  filename:any;
  readData:any;
  decrypted: boolean = false;
  myForm: NgForm;



  onFileChanged(event) {
    let result = fuctbase64(event).then(result => {
      this.fileResult = result;
      console.log(this.fileResult);
    });
  }

  onSubmit(form, isEncrypt){
    console.log(form, "++++++++++++++ Form data ++++++++");
    let firstKey, secondKey;
    if(isEncrypt) {
      firstKey = form.value.firstKey
      secondKey= form.value.secondKey
    } else {
      firstKey = form.value.firstKeyDec
      secondKey= form.value.secondKeyDec
    }
    if(!firstKey || !secondKey || !this.fileResult) {
      alert("All fields are required.");
    } else {
      const secondKeyArr = secondKey.split(",");
      let {base64, name, type} = this.fileResult
      const fip = new fipamo(firstKey, secondKeyArr);
      let data = {base64, name, type}
      this.enc = fip.crypt(data)
      this.download = true;
    }
  }

  onDownload(){
    console.log(this.enc);
    // Note: Ie and Edge don't support the new File constructor,
    // so it's better to construct blobs and use saveAs(blob, filename)
    var file = new File([this.enc], "hello world.enc", {type: "text/plain;charset=utf-8"});
    saveAs(file)
  }

  decryptingFile(event){
    const file = event.target.files[0]
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      const fip = new fipamo("firstKey", ["secondKeyArr"]);
      this.readData = fip.crypt(fileReader.result)
      this.decrypted = true;
    }
    fileReader.readAsText(file);
  }

  downloadAfterDecrypting(){
    let {base64, name, type} = this.readData;
    let file = this.dataURLtoFile(base64, name, type)
    saveAs(file);
  }

  dataURLtoFile(base64, filename, type) {
    // var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
        var bstr = atob(base64), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type});
  }


}
