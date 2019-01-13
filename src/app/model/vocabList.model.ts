import { User as FirebaseUser} from  "nativescript-plugin-firebase"
import { Guid } from "./Guid";


export class VocabList {
title: string;
 uid: string;
 listid: string;

 constructor(title : string, uid: string)
 {
     this.title = title;
     this.uid = uid;
     this.listid = Guid.newGuid();
 }
}