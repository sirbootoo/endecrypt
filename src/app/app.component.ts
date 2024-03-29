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
  fileResultDec: any;
  enc: any;
  download: boolean = false;
  file: any;
  filename:any;
  readData:any;
  decrypted: boolean = false;
  myForm: NgForm;
  myFormDec: NgForm;



  onFileChanged(event, isEncrypt) {
    fuctbase64(event).then(result => {
      this.fileResult = result;
      console.log(this.fileResult);
    });
  }

  onSubmit(form, isEncrypt){
    console.log(form, "++++++++++++++ Form data ++++++++");
    let firstKey, secondKey, file;
    if(isEncrypt) {
      firstKey = form.value.firstKey
      secondKey= form.value.secondKey
      file = this.fileResult;
    } else {
      firstKey = form.value.firstKeyDec
      secondKey= form.value.secondKeyDec
      file = this.fileResultDec;
    }
    if(!firstKey || !secondKey || !file) {
      alert("All fields are required.");
    } else {
      const secondKeyArr = secondKey.split(",").map(item => item.trim());
      let {base64, name, type} = file;
      console.log({base64, name, type}, secondKeyArr, "==============" )
      const fip = new fipamo(firstKey, secondKeyArr);
      if(isEncrypt) {
        let data = {base64, name, type}
        console.log(data)
        const payload = fip.crypt(data);
        console.log(payload, "Enc Payload =================-----========")
        this.enc = payload;
        this.download = true;
      } else {
        const payload = fip.crypt(file)
        console.log(payload, "========= Payload ==========")
        this.readData = payload;
        this.decrypted = true;
      }
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
      this.fileResultDec = fileReader.result;
      // const fip = new fipamo("firstKey", ["secondKeyArr"]);
      // this.readData = fip.crypt(fileReader.result)
      // this.decrypted = true;
    }
    fileReader.readAsText(file);
  }

  downloadAfterDecrypting(){
    let {base64, name, type} = this.readData;
    console.log(base64, "======== base64 =========")
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
