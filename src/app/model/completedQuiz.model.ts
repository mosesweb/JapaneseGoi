import { ClientWord } from "./ClientWord.model";

export class CompletedQuiz {

    public completedDate?: Date;
    public completed?: boolean;
    public listid: string;
    public correctAnswers?: number;
    public userId: string;
    public quizName?: string
    public mistakeWords: Array<ClientWord>;
    public correctWords: Array<ClientWord>;
    constructor(listid: string, quizName: string, completedDate: Date, completed: boolean, uid: string)
    {
        this.listid = listid;
        this.quizName = quizName;
        this.completedDate = completedDate;
        this.completed = completed;
        this.userId = uid;
        
    }
    get getDateShort()  {
        if(this.completedDate !== undefined && this.completedDate != null)
        {
            return this.completedDate.toDateString();
        }
        return ;
    }
}


