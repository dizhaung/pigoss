import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Alarm from '../pages/Alarm';
import Follow from '../pages/Follow';

const AppNavigator = createStackNavigator({
    Alarm,
    Follow,
});

export default createAppContainer(AppNavigator);
