// 数据库数据接口
export interface paper{
    id:number
    tid:number
    title:string
    releaseTime?:string
    timeLimit?:number
    type?:string
    maxTimes?:number
}
export interface question{
    id:number
    pid:number
    description:string
    type:string
    answer:string
    score:number
    answerOBJ?:any
}
export interface exam{
    sid:number
    pid:number
    startTime?:string
    finishTime?:string
    score?:number
    public?:string
    times?:number
    name?:string
    title?:string
}
export interface answer{
    sid:number
    pid:number
    qid:number
    answer?:string
    score?:number
    comment?:string
}
export interface student{
    id:number
    name:string
    school?:string
    class?:string
    pwd:string
}
export interface teacher{
    id:number
    name:string
    school?:string
    department?:string
    pwd:string
}
// 标准答案类型
export class Choice{
    public model//radio,multiAll,mulitiPart
    public choices//选项
    public trueAnswers//正确答案
    public scorePart//没选全得分
    public constructor(model:string,choices:string[],trueAnswers:boolean[],scorePart:number){
        this.model = model
        this.choices = choices
        this.trueAnswers = trueAnswers
        this.scorePart = scorePart
    }
}
export class Blank{
    public trueAnswers
    public scores
    public constructor(trueAnswers:string[][],score:number[]){
        this.trueAnswers = trueAnswers
        this.scores = score
    }
}
export class Code{
    public modules
    public trueAnswers
    public comments
    public scores
    public constructor(modules:string[],trueAnswers:string[],comments:string[],scores:number[]){
        this.modules = modules
        this.trueAnswers = trueAnswers
        this.comments = comments
        this.scores = scores
    }
    // models:string[]//每个匹配的模式:text/reg/ast
    // trueAnswers:string[]//执行多个匹配
    // comments:string[]//如果某个匹配错误给出提示
    // scores:number[]//完成每个匹配给予的分数
}