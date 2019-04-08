import { ClientWord } from "./ClientWord.model";

export class CompletedQuiz {

    public completedDate?: Date;
    public completed?: boolean;
    public listid: string;
    public correctAnswers?: number;
    public userId: string;
    public quizName?: string
    public mistakeWords: Array<ClientWord> = [];
    public correctWords: Array<ClientWord> = [];

    constructor(listid: string, quizName: string, completedDate: Date, completed: boolean, uid: string, correctWords?: Array<ClientWord>, mistakeWords?: Array<ClientWord>) {
        console.log('uid?' + uid);
        this.listid = listid;
        this.quizName = quizName;
        this.completedDate = completedDate;
        this.completed = completed;
        this.userId = uid;
        this.correctWords = correctWords;
        this.mistakeWords = mistakeWords;
    }
    public get getDateShort() {
        if (this.completedDate !== undefined && this.completedDate != null) {
            return this.completedDate.toDateString();
        }
        else
            return "";
    }
    public get getTotalQuestions(): number {
        if ((this.mistakeWords !== undefined && this.mistakeWords != null) &&
            (this.correctWords !== undefined && this.correctWords != null)
        ) {
            return this.mistakeWords.length + this.correctWords.length;
        }
        return 0;
    }
}


