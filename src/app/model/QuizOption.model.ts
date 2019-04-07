import { Sense } from "./sense.model";
import { ClientWord } from "./ClientWord.model";

export class QuizOption extends ClientWord {
  public correctOption?: boolean = false;
  
  constructor(QuizOption: QuizOption)
  {
    super(QuizOption.japanese_reading, QuizOption.japanese_word);
  }
}


