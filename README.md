# 线上答题平台

使用Vue3+Express+Mysql为框架搭建的线上答题平台，能够实现用户的登录注册、教师端的编辑试题，查看并批改学生回答、发布考试结果、学生端的练习考试、查看结果等功能。主要部分使用Vue3，Less以及Typescript进行设计、使用CSS3的Transition功能编写登录界面的简易Web动画、使用Pinia进行全局状态管理、使用Vue Router进行路由配置、使用Express作为框架，对数据库进行CRUD操作、使用Docker部署Mysql数据库。

## 登录界面

![QQ截图20230319230428](https://user-images.githubusercontent.com/60060657/226185359-3791ff70-87d6-4b09-95a2-e129ebd847b9.png)

鼠标悬浮时阴影属性会变化，当切换为注册时容器高度会动态变化

## 主要功能

主要功能已经实现，正在优化UI界面中...

![QQ截图20230319231223](https://user-images.githubusercontent.com/60060657/226185628-048f9de4-41b8-4740-94fd-4594154265f9.png)

学生界面，可以进行在线测试，以及查看测试结果（如图所示的一个功能，如果考试限制次数，不允许重复考试，学生将无法进行第二次考试）


![QQ截图20230319231140](https://user-images.githubusercontent.com/60060657/226185634-1d5d5806-f9eb-4e17-8eea-dd97c07dd345.png)

教师界面，可以实现试卷的编辑、查看学生提交的试卷、并对试卷进行批改以及发布成绩


## 在Docker上部署Mysql数据库

![QQ截图20230319230230](https://user-images.githubusercontent.com/60060657/226185369-66e22ce1-2cb7-4951-80a5-04c33c215209.png)


## 用例图

![QQ截图20230319225905](https://user-images.githubusercontent.com/60060657/226184599-565019b9-eec3-4b02-8c3a-e49b41728f8f.png)

## 数据库类图

![QQ截图20230319225918](https://user-images.githubusercontent.com/60060657/226184621-ff45101d-9439-4373-bce6-7c41f5bbb360.png)
