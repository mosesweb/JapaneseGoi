import { User as FirebaseUser} from  "nativescript-plugin-firebase"
import { Guid } from "./Guid";
import { DataEntity } from "./searchResponse.model";
import { ClientWord } from "./ClientWord.model";


export class VocabList {
title: string;
 uid: string;
 listid: string = null;
 itemcolor: string;
 words: Array<ClientWord>

 constructor(title : string, uid: string, listid: string | null = null)
 {
     this.title = title;
     this.uid = uid;
     this.listid = listid;  
     this.itemcolor = "white";
     this.words = new Array<ClientWord>();
 }
 

 getWordCount = () : number =>
 {
    return this.words.length;
 }
}