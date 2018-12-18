import { User as FirebaseUser} from  "nativescript-plugin-firebase"


export interface User extends FirebaseUser {
    points?: number;
}