import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fetchRequest from '../api';
export default class AlarmDetail extends Component {
  static navigationOptions = {
    title: '资源详情',
  };
  constructor(props) {
    super(props);
    this.state = {
      indicators: [],
      //告警级别映射
      levelMap: [
        {level: 0, value: '正常'},
        {level: 2, value: '警告'},
        {level: 3, value: '次要'},
        {level: 4, value: '主要'},
        {level: 5, value: '紧急'},
      ],
    };
  }
  async componentDidMount(): void {
    console.log(this.props.navigation.state.params);
    let path = this.props.navigation.state.params.path;
    this.getList(path);
  }
  //获取指标列表
  getList = async path => {
    try {
      const data = await fetchRequest('monitors/indicators', 'GET', {
        path: path,
      });
      this.setState({
        indicators: data.indicators,
      });
    } catch (e) {
      console.log(e);
    }
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
        {/*<Text>Detail page</Text>*/}
        {/*<Button title={'next'} onPress={() => navigation.push('Detail')} />*/}
        <View style={styles.container}>
          <Text style={styles.title}>
            {this.props.navigation.state.params.alias}
          </Text>
          <ScrollView>
            <View style={styles.content}>
              {this.state.indicators.map(item => (
                <View style={styles.item} key={item.path}>
                  <View style={styles.icon}>
                    <MaterialIcons
                      name={
                        item.sevirityColor === '#00b300'
                          ? 'check-circle'
                          : 'error'
                      }
                      size={25}
                      color={item.sevirityColor}
                    />
                  </View>
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.alias}</Text>
                    <Text
                      style={{
                        color: item.sevirityColor,
                        paddingRight: 10,
                        fontSize: 14,
                      }}>
                      {item.statusDesc}
                    </Text>
                  </View>
                  <View style={styles.tapIcon}>
                    {item.type === 'IndGroup' ? (
                      <MaterialIcons
                        name={'chevron-right'}
                        size={25}
                        color={'#bbb'}
                        onPress={() =>
                          this.props.navigation.push('ResDetail', item)
                        }
                      />
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    width: '100%',
    height: 30,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
    paddingLeft: 10,
    backgroundColor: '#eee',
  },
  content: {
    height: 'auto',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 80,
    height: 'auto',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    // backgroundColor: 'pink',
  },
  icon: {
    width: 35,
    paddingLeft: 10,
  },
  text: {
    flex: 1,
    justifyContent: 'space-evenly',
    // alignItems: 'center',
    width: '80%',
    height: '100%',
    paddingLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    // backgroundColor: 'yellow',
  },
  desc: {
    paddingRight: 10,
    fontSize: 14,
    // backgroundColor: 'blue',
  },
  tapIcon: {
    width: '10%',
  },
});
