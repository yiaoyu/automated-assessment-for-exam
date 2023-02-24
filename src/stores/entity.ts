export interface paper{
    id:number
    tid:number
    title:string
    releaseTime?:number
    timeLimit?:number
    type?:string
}
export interface question{
    id:number
    pid:number
    description:string
    type:string
    answer:string
}
export interface exam{
    sid:number
    pid:number
    startTime?:number
    finishTime?:number
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