/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import AppContainer from './navigation/index';
import { View } from 'react-native';

export default class App extends Component<Props> {
    render() {
        return (
            <View style={{flex: 1}}>
                <AppContainer />
            </View>
        );
    }
}
