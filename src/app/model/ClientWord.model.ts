import { Sense } from "./sense.model";

export class ClientWord {

    public japanese_reading: string;
    japanese_word: string;
    english: string;
    all_variations: Array<Japanese>;
    senses?: (Sense)[] | null; 
    word_id: string

    constructor(japanese_reading:string)
    {
        if(japanese_reading != "")
        this.japanese_reading = japanese_reading;
    }
}


