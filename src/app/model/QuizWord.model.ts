import { Sense } from "./sense.model";
import { ClientWord } from "./ClientWord.model";
import { QuizOption } from "./QuizOption.model";

export class QuizWord extends ClientWord {
  
    constructor(
        public japanese_reading: string, //a.japanese_reading,
        public japanese_word: string, //a.japanese_word,
        public english: string //a.english
    )
    {
        super("");
        
        this.japanese_reading = japanese_reading;
        this.japanese_word = japanese_word;
        this.english = english;
    }
    public options: Array<QuizOption> = [];

    public setOptions(words: Array<ClientWord>): void {

        let opts: Array<QuizOption> = [];
        let shuffled = [];

        words.forEach(w => {
            
                opts.push(w);
           
        })
        opts.forEach(o => {
            if(
            o.japanese_reading == this.japanese_reading && 
            o.japanese_word == this.japanese_word 
            && o.english == this.english)
            {
                o.correctOption = true;
            }
            else 
                o.correctOption = false;
        });


        let correctOption = opts.find(o => o.correctOption == true);
        let wrong_options: Array<QuizOption> = opts.filter(o => o.correctOption == false);

        let threeOptions: Array<QuizOption> = this.shuffle(wrong_options).slice(0,3);
        threeOptions.push(<QuizOption>correctOption);
        
        this.options = threeOptions;
        
        console.log("set complete");
        console.log(this.options.length);
    }


    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
}


