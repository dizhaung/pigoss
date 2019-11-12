import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';

export default class Alarm extends Component {
    static navigationOptions = {
      title: '告警',
    };

    render():
        | React.ReactElement<any>
        | string
        | number
        | {}
        | React.ReactNodeArray
        | React.ReactPortal
        | boolean
        | null
        | undefined {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <Text>Alarm</Text>
            </SafeAreaView>
        );
    }
}

