import React, {Component} from 'react';
import {SafeAreaView, TextInput, View, StyleSheet, YellowBox} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import Handled from './Handled';
import Untreated from './Untreated';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Alarm extends Component {
  // static navigationOptions = {
  //   title: '告警',
  // };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      tabIndex: 0,
    };
  }

  //input框内容变化触发的函数
  handleChange = text => {
    this.setState({value: text});
  };

  //按下enter键触发搜索
  onSearch = () => {
    const targetTab = this.refs[
      this.state.tabIndex === 0 ? 'untreated' : 'handled'
    ];
    targetTab.clearState();
    targetTab.getList(this.state.value);
  };

  // tab 切换触发清空非激活tab状态，搜索激活tab数据
  handleTab = ({from, i, ref}) => {
    if (!ref || from !== i) {
      return null;
    }
    this.setState({
      tabIndex: i,
    });
    const targetTab = this.refs[i === 0 ? 'handled' : 'untreated'];
    targetTab && targetTab.clearState();
    this.refs[i === 0 ? 'untreated' : 'handled'].getList(this.state.value);
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
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={styles.search}>
            <TextInput
              style={styles.input}
              value={this.state.value}
              placeholder="搜索"
              underlineColorAndroid='transparent'
              placeholderTextColor="#888"
              onChangeText={this.handleChange}
              onSubmitEditing={this.onSearch}
            />
          </View>
          <View style={styles.list}>
            <ScrollableTabView
              initialPage={0}
              renderTabBar={() => <ScrollableTabBar />}
              tabBarUnderlineStyle={{backgroundColor: '#459cd2'}}
              tabBarActiveTextColor="#000"
              tabBarInactiveTextColor="#888"
              onChangeTab={obj => this.handleTab(obj)}>
              <Untreated
                navigation={navigation}
                ref={'untreated'}
                tabLabel={'未处理告警'}
              />
              <Handled
                navigation={navigation}
                ref={'handled'}
                tabLabel={'已处理告警'}
              />
            </ScrollableTabView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
  },
  button: {},
  list: {
    flex: 1,
  },
});
