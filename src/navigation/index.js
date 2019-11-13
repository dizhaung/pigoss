import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import Alarm from '../pages/Alarm';
import Follow from '../pages/Follow';

const AppNavigator = createStackNavigator({
    Alarm,
    Follow,
});

export default createAppContainer(AppNavigator);
