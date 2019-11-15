import React from 'react';
import {createAppContainer, createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Alarm from '../pages/alarm/Alarm';
import Follow from '../pages/Follow';
import Home from '../pages/Home';
import Monitor from '../pages/Monitor';
import AlarmDetail from '../pages/AlarmDetail';
import ResDetail from '../pages/ResDetail';
// tab 配置
const tabBars = [
    {label: '告警', page: 'Alarm', icon: 'bell'},
    {label: '关注', page: 'Follow', icon: 'heart'},
    {label: '主页', page: 'Home', icon: 'home'},
    {label: '监控', page: 'Monitor', icon: 'monitor'},
];

// 默认导航配置
const defaultNavigationOptions = {
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#5e7eef',
        // 因为tab下部出现一条白线，暂且使用这种方式进行隐藏
        borderBottomWidth: -1,
    },
    headerTitleStyle: {},
};

// 主页路由
const homeStack = createStackNavigator(
    {
        Home,
    },
    {
        defaultNavigationOptions,
    },
);

// 告警路由
const alarmStack = createStackNavigator(
    {
        Alarm: {
            screen: Alarm,
            navigationOptions: {
                title: '告警',
            },
        },
        AlarmDetail: {
            screen: AlarmDetail,
            navigationOptions: {
                title: '告警详情',
            },
        },
    },
    {
        defaultNavigationOptions,
    },
);

// 关注导航
const followStack = createStackNavigator(
    {
        Follow,
    },
    {
        defaultNavigationOptions,
    },
);

// 监控导航
const monitorStack = createStackNavigator(
    {
        Monitor,
        ResDetail,
    },
    {
        defaultNavigationOptions,
    },
);

// tab 路由
const AppBottomTabNavigator = createBottomTabNavigator(
    {
        Home: homeStack,
        Alarm: alarmStack,
        Follow: followStack,
        Monitor: monitorStack,
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let [{icon}] = tabBars.filter(tab => tab.page === routeName);
                return <FeatherIcons name={icon} size={25} color={tintColor} />;
            },
            tabBarLabel: tabBars.filter(
                tab => tab.page === navigation.state.routeName,
            )[0].label,
        }),
        tabBarOptions: {
            activeTintColor: '#5e7eef',
            inactiveTintColor: '#707589',
            indicatorStyle: {
                height: 0,
            },
            style: {
                // 因为tab上部出现一条白线，暂且使用这种方式进行隐藏
                borderTopWidth: -1,
                backgroundColor: 'white',
                height: 50,
                paddingTop: 2,
                paddingBottom: 3,
            },
        },
    },
);

export default createAppContainer(AppBottomTabNavigator);
