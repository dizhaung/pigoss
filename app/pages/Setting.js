import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';

export default class Setting extends Component {
  static navigationOptions = {
    title: '设置',
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Text>Setting page</Text>
      </SafeAreaView>
    );
  }
}
