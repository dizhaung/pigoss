import React, {Component} from 'react';
import {SafeAreaView, Text, Button} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';


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
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <Text>Alarm</Text>
                <Button title={'press'} onPress={() => navigation.navigate('Follow')} />
                <FeatherIcons name={'home'} size={25} />
            </SafeAreaView>
        );
    }
}

