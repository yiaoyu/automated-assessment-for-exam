// 基础数据接口
export interface paper{
    id:number
    tid:number
    title:string
    releaseTime?:string
    timeLimit?:number
    type?:string
    maxTimes?:number
    description?:string
    closed?:string
}
export interface question{
    id:number
    pid:number
    description:string
    type:string
    answer:string
    score:number
    answerOBJ?:any
    currentAnswerType?:string
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
    answerOBJ?:any
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
export class Choice{//选择题
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
export class Blank{//填空题
    public trueAnswers//填空题的正确答案（每个空有多个匹配方式）
    public scores//每个空的分数
    public constructor(trueAnswers:string[][],scores:number[]){
        this.trueAnswers = trueAnswers
        this.scores = scores
    }
}
export class Code{//编程题
    //一个题目有多个检测
    public modules//每个检测的类型text/reg/ast
    public checks//每个检测需要执行的用例（ast不需要）
    public trueAnswers//每个检测结果的匹配
    public comments//错误信息
    public scores//通过每个检测获得的分数
    public frame//回答的框架function xxx(){};
    public constructor(modules:string[],checks:string[],trueAnswers:string[],comments:string[],scores:number[],frame:string){
        this.modules = modules
        this.checks = checks
        this.trueAnswers = trueAnswers
        this.comments = comments
        this.scores = scores
        this.frame = frame
    }
}