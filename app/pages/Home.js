import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import AlarmChart from '../components/AlarmChart';
import fetchRequest from '../api';

const legend = [
  {name: '紧急: ', symbol: {fill: '#ff1a1a'}},
  {name: '主要: ', symbol: {fill: '#ff8000'}},
  {name: '次要: ', symbol: {fill: '#e6b800'}},
  {name: '警告: ', symbol: {fill: '#0099cc'}},
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      treatedCount: '',
      treatedData: [],
      treatedLegend: [],
      untreatedCount: '',
      untreatedData: [],
      untreatedLegend: [],
    };
  }

  static navigationOptions = {
    title: '告警视图',
  };

  // 登录接口
  getLogin = async () => {
    try {
      const {data} = await fetchRequest('sessions/login', 'POST', {
        username: 'pigoss',
        password: 'pigoss',
      });
      this.setState({
        isLogin: true,
      });
    } catch (e) {
      this.setState({
        isLogin: false,
      });
    }
  };
  // 接口获取数据
  getHomeAlarm = async () => {
    try {
      const {treated, untreated} = await fetchRequest('events/home', 'GET');

      // 格式化已处理数据
      const treatedObj = treated.reduce((pre, cur) =>
        Object.assign({}, pre, cur),
      );

      // 已处理告警数
      const treatedData = [
        treatedObj.criticalCount,
        treatedObj.mayorCount,
        treatedObj.minorCount,
        treatedObj.warningCount,
      ];

      // 已处理告警总数
      const treatedCount = Object.values(treatedObj).reduce(
        (pre, cur) => Number(pre) + Number(cur),
      );

      // 已处理告警标题
      const treatedLegend = JSON.parse(JSON.stringify(legend)).map(
        (item, index) => {
          item.name += treatedData[index] + '个';
          return item;
        },
      );

      // 格式化未处理数据
      const untreatedObj = untreated.reduce((pre, cur) =>
        Object.assign({}, pre, cur),
      );

      // 未处理告警数
      const untreatedData = [
        untreatedObj.criticalCount,
        untreatedObj.mayorCount,
        untreatedObj.minorCount,
        untreatedObj.warningCount,
      ];

      // 未处理告警总数
      const untreatedCount = Object.values(untreatedObj).reduce(
        (pre, cur) => Number(pre) + Number(cur),
      );

      // 未处理告警标题
      const untreatedLegend = JSON.parse(JSON.stringify(legend)).map(
        (item, index) => {
          item.name += untreatedData[index] + '个';
          return item;
        },
      );

      this.setState({
        treatedCount,
        treatedData,
        treatedLegend,
        untreatedCount,
        untreatedData,
        untreatedLegend,
      });
    } catch (e) {
      console.log(e);
    }
  };

  getAlarm = () => {
    this.getHomeAlarm();
    this.timer = setInterval(() => {
      this.getHomeAlarm();
    }, 1000 * 20);
  };

  // 销毁定时器
  destroyTimer = () => this.timer && clearInterval(this.timer);

  // 聚焦该页面获取接口数据
  onWillFocus = async () => {
    if (this.state.isLogin) {
      this.getAlarm();
    } else {
      await this.getLogin();
      this.getAlarm();
    }
  };

  // 焦点移出取消定时器
  onWillBlur = () => this.destroyTimer();

  // 组件销毁取消定时器
  componentWillUnmount = () => this.destroyTimer();

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
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
        />
        {/* S 未处理告警*/}
        <View style={styles.panel}>
          <View style={styles.title}>
            <Text style={styles.text}>未处理告警</Text>
          </View>
          <View style={styles.chart}>
            <AlarmChart
              title={'未处理'}
              count={this.state.untreatedCount}
              data={this.state.untreatedData}
              legend={this.state.untreatedLegend}
            />
          </View>
        </View>
        {/* E 未处理告警*/}

        {/* S 已处理告警*/}
        <View style={styles.panel}>
          <View style={styles.title}>
            <Text style={styles.text}>已处理告警</Text>
          </View>
          <View style={styles.chart}>
            <AlarmChart
              title={'已处理'}
              count={this.state.treatedCount}
              data={this.state.treatedData}
              legend={this.state.treatedLegend}
            />
          </View>
        </View>
        {/* E 已处理告警*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panel: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: '#041520',
  },
  text: {
    margin: 0,
    color: 'whitesmoke',
  },
  chart: {
    flex: 1,
  },
});
