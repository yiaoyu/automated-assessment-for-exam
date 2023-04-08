const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const jwt = require("jsonwebtoken")
const app = express()

app.use(cors())
//application/x-www-form-urlencoded为原生form表单
app.use(express.json()); 
//连接数据库
const conn = mysql.createConnection({
	host:"localhost",	
	user:"root",	
	password:"1234",	
	database:"EXAMDB"	
})
conn.connect()
//生成token
const secretKey = "secretKey"//生成令牌的秘钥
function generateToken(payload){
	const token = "Bearer " + jwt.sign(payload, secretKey, {expiresIn: 60 * 60,})
  	return token
}
//验证token
app.post("/verify",(req,res)=>{
	const token = req.headers.authorization.split(" ")[1];
	jwt.verify(token, secretKey, function (err, decoded) {
		if (err) {
		console.log("token_verify_fail",err);
		return res.json({msg: "token_verify_fail" });
		}
		if(decoded.userName.split("/")[0]=="teacher"){
			if(req.body.type=="teacher"){
				res.json({msg: "token_verify_success" });
			}else{
				res.json({msg: "token_verify_fail" });
			}
		}else{
			if(req.body.type=="student"){
				res.json({msg: "token_verify_success" });
			}else{
				res.json({msg: "token_verify_fail" });
			}
		}
	});
})
// 模板
// app.post("/",(req,res)=>{
// 	conn.execute(
// 		"",
// 		[,],
// 		function(error, results, fields) {
// 			if(error){
// 				console.log(error)
// 				res.json({
// 					msg:"fail"
// 				})
// 			}else{
// 				res.json({
// 					msg:"success"
// 				})
// 			}
// 		}
// 	)
// })
// 增加考试
app.post("/addexam",(req,res)=>{
	conn.execute(
		"INSERT INTO exam (sid,pid,startTime,times) VALUES (?,?,?,?)",
		[req.body.sid,req.body.pid,req.body.startTime,req.body.times],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 删除考试
app.post("/removeexam",(req,res)=>{
	conn.execute(
		"DELETE FROM exam WHERE sid=? and pid=?",
		[req.body.sid,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 修改考试
app.post("/changeexam",(req,res)=>{
	conn.execute(
		"UPDATE exam SET startTime=?,finishTime=?,score=?,public=?,times=? WHERE sid=? and pid=?",
		[req.body.startTime,req.body.finishTime,req.body.score,req.body.public,req.body.times,req.body.sid,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 公布考试结果
app.post("/publishexam",(req,res)=>{
	conn.execute(
		"UPDATE exam SET public=? WHERE pid=?",
		[req.body.public,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 通过试卷号查询考试
app.post("/getexambypid",(req,res)=>{
	conn.execute(
		"select s.name,e.sid,e.pid,e.startTime,e.finishTime,e.score,e.public,e.times from exam e inner join student s on s.id=e.sid and e.pid=?",
		[req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
// 通过学生id查询考试
app.post("/getexambysid",(req,res)=>{
	conn.execute(
		"select p.title,e.sid,e.pid,e.startTime,e.finishTime,e.score,e.public,e.times from exam e inner join paper p on e.pid=p.id where e.sid=?",
		[req.body.sid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
// 通过两个id查询某个考试
app.post("/getexambysidpid",(req,res)=>{
	conn.execute(
		"select s.name,e.sid,e.pid,e.startTime,e.finishTime,e.score,e.public,e.times from exam e inner join student s on s.id=e.sid and e.sid=? and e.pid=?",
		[req.body.sid,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
// 增加回答
app.post("/addanswer",(req,res)=>{
	conn.execute(
		"INSERT INTO answer (sid,pid,qid,answer,score,comment) VALUES (?,?,?,?,?,?)",
		[req.body.sid,req.body.pid,req.body.qid,req.body.answer,req.body.score,req.body.comment],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 删除回答
app.post("/removeanswer",(req,res)=>{
	conn.execute(
		"DELETE FROM answer WHERE sid=? and pid=?",
		[req.body.sid,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 修改回答
app.post("/changeanswer",(req,res)=>{
	conn.execute(
		"UPDATE answer SET answer=?,score=?,comment=?",
		[req.body.answer,req.body.score,req.body.comment],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
// 查询回答
app.post("/selectanswerbysidpid",(req,res)=>{
	conn.execute(
		"SELECT sid,pid,qid,answer,score,comment FROM answer WHERE sid=? and pid=?",
		[req.body.sid,req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
//增加试题
app.post("/addquestion",(req,res)=>{
	conn.execute(
		"INSERT INTO question (pid,description,type,answer) VALUES (?,?,?,?)",
		[req.body.pid,req.body.description,req.body.type,req.body.answer],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//删除试题
app.post("/removequestion",(req,res)=>{
	conn.execute(
		"DELETE FROM question WHERE id=?",
		[req.body.id],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//修改试题
app.post("/changequestion",(req,res)=>{
	conn.execute(
		"UPDATE question SET description=?,type=?,answer=?,score=? WHERE id=?",
		[req.body.description,req.body.type,req.body.answer,req.body.score,req.body.id],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//选择某个卷子中的所有题目
app.post("/getallquestion",(req,res)=>{
	conn.execute(
		"SELECT id,pid,description,type,answer,score FROM question WHERE pid=?",
		[req.body.pid],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
//增加新试卷
app.post("/addpaper",(req,res)=>{
	conn.execute(
		"INSERT INTO paper (tid,title,type) VALUES (?,?,?)",
		[req.body.tid,req.body.title,req.body.type],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//删除试卷
app.post("/removepaper",(req,res)=>{
	conn.execute(
		"DELETE FROM paper WHERE id=?",
		[req.body.id],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//修改试卷信息
app.post("/changepaper",(req,res)=>{
	conn.execute(
		"UPDATE paper SET title=?,releaseTime=?,timeLimit=?,type=?,maxTimes=? WHERE id=?;",
		[req.body.title,req.body.releaseTime,req.body.timeLimit,req.body.type,req.body.maxTimes,req.body.id],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success"
				})
			}
		}
	)
})
//获取所有试卷
app.post("/getallpaper",(req,res)=>{
	conn.query(
		"SELECT id,tid,title,releaseTime,timeLimit,type,maxTimes FROM paper",
		[],
		function(error, results, fields) {
			if(error){
				console.log(error)
				res.json({
					msg:"fail"
				})
			}else{
				res.json({
					msg:"success",
					data:results
				})
			}
		}
	)
})
//修改信息
app.post("/changeinfo",(req,res)=>{
	if(req.body.type=="teacher"){
		conn.execute(
			"UPDATE teacher SET name=?,school=?,department=? WHERE id=?",
			[req.body.name,req.body.school,req.body.department,req.body.id],
			function(error, results, fields) {
				if(error){
					console.log(error)
					if(error.code=='ER_DUP_ENTRY'){
						res.json({
							msg:"ER_DUP_ENTRY",
						})
					}else{
						res.json({
							msg:"fail",
						})
					}
				}else{
					res.json({
						msg:"success",
						school:req.body.school,
						departmen:req.body.department,
						name:req.body.name
					})
				}
			}
		)
	}
	if(req.body.type=="student"){
		conn.execute(
			"UPDATE student SET name=?,school=?,class=? WHERE id=?",
			[req.body.name,req.body.school,req.body.class,req.body.id],
			function(error, results, fields) {
				if(error){
					console.log(error)
					if(error.code=='ER_DUP_ENTRY'){
						res.json({
							msg:"ER_DUP_ENTRY",
						})
					}else{
						res.json({
							msg:"fail",
						})
					}
				}else{
					res.json({
						msg:"success",
						school:req.body.school,
						class:req.body.class,
						name:req.body.name
					})
				}
			}
		)
	}
})
//修改密码
app.post("/changepwd",(req,res)=>{
	if(req.body.type=="teacher"){
		conn.execute(
			"UPDATE teacher SET pwd=? WHERE id=? and pwd=?",
			[req.body.newPwd,req.body.id,req.body.currentPwd],
			function(error, results, fields) {
				if(error){
					console.log(error)
					res.json({
						msg:"fail",
					})
				}else{
					if(results.changedRows==1){
						res.json({
							msg:"success",
						})
					}else{
						res.json({
							msg:"wrong_pwd",
						})
					}
				}
			}
		)
	}
	if(req.body.type=="student"){
		conn.execute(
			"UPDATE student SET pwd=? WHERE id=? and pwd=?",
			[req.body.newPwd,req.body.id,req.body.currentPwd],
			function(error, results, fields) {
				if(error){
					console.log(error)
					res.json({
						msg:"fail",
					})
				}else{
					if(results.changedRows==1){
						res.json({
							msg:"success",
						})
					}else{
						res.json({
							msg:"wrong_pwd",
						})
					}
				}
			}
		)
	}
})
//注册
app.get("/register",(req, res)=>{
	if(req.query.userType=="teacher"){
		conn.execute(
			"INSERT INTO teacher (name,school,department,pwd) values (?,'','',?)",
			[req.query.userName,req.query.userPwd],
			function(error, results, fields) {
				if(error){
					res.send(error.code)
				}else{
					res.send("success")
				}
			}
		)
		return
	}
	if(req.query.userType=="student"){
		conn.execute(
			"INSERT INTO student (name,school,class,pwd) values (?,'','',?)",
			[req.query.userName,req.query.userPwd],
			function(error, results, fields) {
				if(error){
					res.send(error.code)
				}else{
					res.send("success")
				}
			}
		)
		return
	}
	res.send(
		"unknow failure"
	)
})
app.listen(9000,()=>{
	console.log("success in 9000")
})
//登录
app.get("/login",(req,res)=>{
	if(req.query.userType=="teacher"){
		conn.execute(
			"SELECT id,name,school,department,pwd from teacher where name = ?",
			[req.query.userName],
			function(error, results, fields) {
				if(error){
					res.send(error.code)
				}else{
					if(results.length==0){
						res.json({
							msg:"name_not_find",
						})
						return
					}
					if(results[0].pwd==req.query.userPwd){
						res.json({
							msg:"success",
							id:results[0].id,
							name:results[0].name,
							school:results[0].school,
							department:results[0].department,
							token:generateToken({userName: 'teacher/' + req.query.userName})
						})
						
					}else{
						res.json({
							msg:"wrong_password",
						})
					}
				}
			}
		)
		return
	}
	if(req.query.userType=="student"){
		conn.execute(
			"SELECT id,name,school,class,pwd from student where name = ?",
			[req.query.userName],
			function(error, results, fields) {
				if(error){
					res.send(error.code)
				}else{
					if(results.length==0){
						res.json({
							msg:"name_not_find",
						})
						return
					}
					if(results[0].pwd==req.query.userPwd){
						res.json({
							msg:"success",
							id:results[0].id,
							name:results[0].name,
							school:results[0].school,
							class:results[0].class,
							token:generateToken({userName: 'student/' + req.query.userName})
						})
					}else{
						res.json({
							msg:"wrong_password",
						})
					}
				}
			}
		)
		return
	}
	res.send(
		"unknow failure"
	)
})
