import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';

export default class Follow extends Component {
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
                <Text>Follow</Text>
            </SafeAreaView>
        );
    }
}

