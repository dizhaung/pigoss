import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import moment from 'moment';
import fetchRequest from '../api';

export default class AlarmDetail extends Component {
  static navigationOptions = {
    title: '告警详情',
  };
  constructor(props) {
    super(props);
    this.state = {
      alarmTitle: [
        {name: '告警描述:', type: 0, value: 'eventDesc'},
        {name: '告警级别:', type: 1, value: 'level'},
        {name: '告警源:', type: 2, value: 'eventSource'},
        {name: '最新时间:', type: 3, value: 'updateTime'},
        {name: '发生次数:', type: 4, value: 'times'},
        {name: '告警历时:', type: 5, value: 'lastedTime'},
        {name: '所属业务', type: 6, value: 'businessName'},
        {name: '告警确认:', type: 7, value: 'ackTime'},
        {name: '责任人:', type: 8, value: 'owner'},
        {name: '联系电话:', type: 9, value: 'contactNumber'},
        {name: '邮箱地址:', type: 10, value: 'email'},
        {name: '告警发生时间:', type: 11, value: 'startTime'},
        {name: '详细描述:', type: 12, value: 'eventDetail'},
        {name: '备注:', type: 13, value: 'remark'},
      ],
      alarmDetail: {},
    };
    //告警级别映射
    this.levelMap = [
      {level: 0, value: '正常'},
      {level: 2, value: '警告'},
      {level: 3, value: '次要'},
      {level: 4, value: '主要'},
      {level: 5, value: '紧急'},
    ];
  }
  async componentDidMount(): void {
    if (this.props.navigation.state.params !== undefined) {
      let id = this.props.navigation.state.params.id;
      let url = 'events/' + id;
      try {
        const data = await fetchRequest(url, 'GET');
        data.level = this.levelMap.find(
          level => level.level === data.level,
        ).value;
        data.clearUser = data.clearUser ? data.clearUser + '/' : '';
        data.ackTime = data.ackTime
          ? data.clearUser + moment(data.ackTime).format('YYYY-MM-DD HH:mm:ss')
          : null;
        data.startTime = data.startTime
          ? moment(data.startTime).format('YYYY-MM-DD HH:mm:ss')
          : null;
        data.updateTime = data.updateTime
          ? moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')
          : null;
        data.eventDetail = data.eventDetail
          ? data.eventDetail.replace(/(<br>)/g, '')
          : null;
        this.setState({
          alarmDetail: data,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
  //时间戳补0
  timeAdd0 = str => {
    if (str.length <= 1) {
      str = '0' + str;
    }
    return str;
  };
  //聚焦该页面获取接口数据
  // onWillFocus = async () => {
  //   console.log(this.props.navigation.params);
  // };
  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
        />
        <View style={styles.container}>
          <Text numberOfLines={1} style={styles.title}>
            {this.state.alarmDetail.resName + this.state.alarmDetail.ip}
          </Text>
          <ScrollView>
            <View style={styles.content}>
              {this.state.alarmTitle.map((item, index) => (
                <View style={styles.item} key={index}>
                  <Text style={styles.name}>
                    {item.name}
                    {/*<Text style={styles.desc}>*/}
                    {/*  {this.state.alarmDetail[item.value]*/}
                    {/*    ? this.state.alarmDetail[item.value]*/}
                    {/*    : ''}*/}
                    {/*</Text>*/}
                  </Text>
                  <Text style={styles.desc}>
                    {this.state.alarmDetail[item.value]}
                  </Text>
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
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    // minHeight: '50',
    // height: 'auto',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
    paddingLeft: 10,
    // alainSelf: 'flex-start',
    // textAlign: 'center',
    // backgroundColor: 'yellow',
  },
  desc: {
    // width: '80%',
    flex: 1,
    fontWeight: 'normal',
    paddingLeft: 10,
    paddingRight: 10,
  },
});
