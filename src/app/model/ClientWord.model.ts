import { Sense } from "./sense.model";

export class ClientWord {

    public japanese_reading: string;
    japanese_word: string;
    english: string;
    all_variations: Array<Japanese>;
    senses?: (Sense)[] | null; 
    word_id: string;



    public japaneseFullReading? = "";
    public japaneseWordOrReading? = "";

    constructor(japanese_reading:string, japanese_word:string)
    {
        if(japanese_reading != "")
        {
            this.japanese_reading = japanese_reading;
            this.japaneseFullReading = japanese_reading;
        }

        if(japanese_word != "")
        {
            this.japanese_word = japanese_word;
            this.japaneseFullReading = japanese_word + ' [' + this.japanese_reading + ']';
        }

        this.japaneseWordOrReading = (this.japanese_word != "" && this.japanese_word != null) ? this.japanese_word : this.japanese_reading;

        
    }

    

   
}


