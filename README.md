# pigoss智慧运维服务中心
网利友联科技(北京)有限公司 pigoss智慧运维服务中心

## 目录结构
```
├── app
│   ├── api  // 接口封装
│   │   └── index.js  
│   ├── components  // 组件文件夹
│   │   └── AlarmChart.js  // 图表组件
│   ├── index.js  // 入口文件
│   ├── navigation
│   │   └── index.js  // 基础路由
│   └── pages  // 视图文件夹
│       ├── AlarmDetail.js  // 告警详情
│       ├── Follow.js  // 我的关注视图
│       ├── Home.js  // 主页
│       ├── Monitor.js  // 监控视图
│       ├── ResDetail.js  // 资源详情
│       └── alarm
│           ├── Alarm.js  // 告警视图
│           ├── Handled.js  // 已处理告警
│           └── Untreated.js  // 未处理告警
```

## 所用组件库

```
"react": "16.3.1",
"react-native": "0.55.4",
"react-native-gesture-handler": "1.0.12",
"react-native-scrollable-tab-view": "^1.0.0",
"react-native-svg": "6",
"react-native-vector-icons": "4.6.0",
"react-navigation": "3.8.1",
"@react-native-community/viewpager": "^2.0.2",
"moment": "^2.24.0",
"victory-native": "^33.0.0"  // 图表组件库
```

## 路由结构

```
├── Home 主视图  
├── Alarm 告警视图
│   ├── Alarm 告警页面 （包含两个tab导航页）
│   │   ├── Untreated 未处理告警页面
│   │   └── Handled 已处理告警页面
│   └── AlarmDetail 告警详情页面 
├── Follow 关注视图
│   ├── Follow 关注页面
│   └── ResDetail 关注的资源详情页面 
└── Monitor监控视图
    ├── Monitor 监控页面
    └── ResDetail 监控资源详情页面 

```
