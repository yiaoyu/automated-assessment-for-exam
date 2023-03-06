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