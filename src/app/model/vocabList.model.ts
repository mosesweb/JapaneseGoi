import { User as FirebaseUser} from  "nativescript-plugin-firebase"


export class VocabList {
title: string;
 uid: string;

 constructor(title : string, uid: string)
 {
     this.title = title;
     this.uid = uid;
 }
}