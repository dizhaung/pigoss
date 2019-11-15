import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import fetchRequest from '../api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// tab 位置记录
let tabIndex = -1;

export default class Monitor extends Component {
  static navigationOptions = {
    title: '资源视图',
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectActive: 0,
      refreshing: false,
      groupsList: [
        {
          path: '',
          alias: '所有设备',
          type: 'ResGroup',
          child_group: [],
        },
      ],
      list: [],
      topList: [],
    };
    this.start = 0;
    this.isContinue = true;
    this.path = '';
    this.keyword = '';
  }

  // 初始化
  async componentDidMount(): void {
    await this.getGroup();
    await this.getList();
  }

  //获取左边资源组的列表
  getGroup = async () => {
    try {
      const data = await fetchRequest('monitors/resGroup', 'GET', {
        isDeep: false,
      });
      this.setState({
        groupsList: this.state.groupsList.concat(data.groups),
      });
    } catch (e) {
      console.log(e);
    }
  };
  //点击左边导航栏触发的函数
  changeSide = (item, index) => {
    // 重置 tab 位置记录
    tabIndex = -1;
    this.setState({
      selectActive: index,
      value: '',
    });
    this.isContinue = true;
    if (item.alias === '所有设备') {
      this.setState({
        list: [],
      });
      this.start = 0;
      this.isContinue = true;
      this.getList();
    } else {
      this.getTopList(item.path);
    }
  };
  //获取列表数据
  getList = async (path, keyword) => {
    this.keyword = keyword ? keyword : '';
    this.setState({
      refreshing: this.start === 0,
    });
    this.path = path;
    let params;
    params = path ? {start: this.start, path: path} : {start: this.start};
    if (keyword) {
      params = {start: this.start, keyword};
      this.setState({
        selectActive: 0,
      });
    }
    try {
      const data = await fetchRequest('monitors/res', 'GET', params);
      this.isContinue = data.length !== 0;
      this.setState({
        list: [...this.state.list, ...data],
        refreshing: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  // 获取顶部导航栏的数据
  getTopList = async path => {
    this.setState({
      topList: [],
      list: [],
    });
    try {
      const data = await fetchRequest('monitors/resGroup', 'GET', {
        isDeep: true,
        path: path,
      });
      this.setState({
        topList: data.groups,
      });
      this.start = 0;
      this.isContinue = true;
      this.path = data.groups[0].path;
    } catch (e) {
      console.log(e);
    }
  };

  //顶部tab栏切换
  handleTab = ({from, i, ref}) => {
    if (!ref || from !== i) {
      return null;
    }
    if (tabIndex !== i) {
      tabIndex = i;
      this.start = 0;
      this.isContinue = true;
      this.setState({
        refreshing: true,
        list: [],
      });
      this.getList(this.state.topList[i].path);
    }
  };
  //添加和取消关注接口
  followChange = async item => {
    let obj = {isAttned: item.isAttned === '0' ? '1' : '0'};
    try {
      const data = await fetchRequest('monitors/res', 'PUT', {
        path: item.path,
        params: JSON.stringify(obj),
      });
      if (data) {
        alert(obj.isAttned==='0'?'取消关注成功':'关注成功')
        this.setState({
          list: this.state.list.map(i =>
              i.path === item.path
                  ? Object.assign(item, {isAttned: obj.isAttned})
                  : i,
          ),
        });
      }
    } catch (e) {
      alert('操作失败');
      console.log(e);
    }
  };
  //列表下拉刷新功能
  onRefresh = async () => {
    this.setState({
      value:'',
      list: [],
      refreshing: true,
      selectActive: 0,
    });
    this.start = 0;
    await this.getList();
  };
  //上拉加载
  loadingMore = async () => {
    if (this.isContinue) {
      this.start += 30;
      await this.getList(this.path, this.keyword);
    }
  };
  // 尾部组件
  footer = () => {
    if (this.state.refreshing) {
      return null;
    }
    if (this.state.list.length > 30) {
      return (
        <View>
          {!this.isContinue ? (
            <Text style={{color: '#999', fontSize: 14, textAlign: 'center'}}>
              暂无更多数据
            </Text>
          ) : (
            <ActivityIndicator size={'large'} animating={true} />
          )}
        </View>
      );
    } else {
      return null;
    }
  };
  //input框内容变化触发的函数
  handleChange = text => {
    this.setState({value: text});
  };

  //按下enter键触发搜索
  onSearch = () => {
    this.setState({
      list: [],
    });
    this.start = 0;
    this.getList('', this.state.value);
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
        <View style={styles.container}>
          <View style={styles.search}>
            <TextInput
              style={styles.input}
              value={this.state.value}
              placeholder="搜索"
              placeholderTextColor="#888"
              underlineColorAndroid='transparent'
              onChangeText={this.handleChange}
              onSubmitEditing={this.onSearch}
            />
          </View>
          <View style={styles.wrap}>
            <View style={styles.sideBar}>
              <ScrollView>
                {this.state.groupsList.map((item, index) => (
                  <TouchableOpacity
                    key={item.path}
                    style={
                      this.state.selectActive === index
                        ? styles.activeButton
                        : styles.button
                    }
                    onPress={() => this.changeSide(item, index)}>
                    <Text
                      style={
                        this.state.selectActive === index
                          ? styles.activeText
                          : styles.buttonText
                      }>
                      {item.alias}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.content}>
              {this.state.selectActive !== 0 ? (
                <View style={styles.topBar}>
                  <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar />}
                    tabBarUnderlineStyle={{backgroundColor: '#459cd2'}}
                    tabBarActiveTextColor="#000"
                    tabBarInactiveTextColor="#888"
                    onChangeTab={obj => this.handleTab(obj)}>
                    {this.state.topList.map(item => (
                      <Text tabLabel={item.alias} key={item.path} />
                    ))}
                  </ScrollableTabView>
                </View>
              ) : null}
              <View style={styles.list}>
                <FlatList
                  data={this.state.list}
                  initialNumToRender={30}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      colors={['pink']}
                      progressBackgroundColor={'white'}
                      progressViewOffset={200}
                      onRefresh={this.onRefresh}
                    />
                  }
                  keyExtractor={item => item.path.toString()}
                  onEndReached={() => this.loadingMore()}
                  ListFooterComponent={() => this.footer()}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('ResDetail', item)
                      }>
                      <View style={styles.item} key={item.path}>
                        <View style={styles.icon}>
                          <Image
                            source={{
                              uri: `https://bsm.netistate.com:8443${item.icon}`,
                            }}
                            style={{width: 60, height: 60}}
                          />
                        </View>
                        <View style={styles.contentDesc}>
                          <Text numberOfLines={1} style={styles.text}>
                            {item.ip
                              ? item.alias + ' (' + item.ip + ')'
                              : item.alias}
                          </Text>
                          <Text
                            style={{
                              color: item.sevirity.total.rgb,
                              fontSize: 14,
                            }}>
                            总指标:{item.sevirity.total.count}个；正常:
                            {item.sevirity.normal.count}个;异常:
                            {item.sevirity.abnormal.count}个;
                            {/*<text*/}
                            {/*  style={{*/}
                            {/*    color:*/}
                            {/*      item.sevirity.abnormal.count == 0*/}
                            {/*        ? item.sevirity.total.rgb*/}
                            {/*        : item.sevirity.abnormal.rgb,*/}
                            {/*  }}>*/}
                            {/*  异常:{item.sevirity.abnormal.count}个;*/}
                            {/*</text>*/}
                          </Text>
                        </View>
                        <View style={styles.heart}>
                          {/*{item.isAttned == 1 ? (*/}
                          <MaterialIcons
                            name={'favorite'}
                            size={18}
                            color={item.isAttned == 1 ? '#469cd1' : '#aaa'}
                            onPress={() => this.followChange(item, index)}
                          />
                          {/*) : null}*/}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
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
  wrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sideBar: {
    width: 84,
    zIndex: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eee',
    borderLeftWidth: 5,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonText: {
    fontSize: 12,
    color: '#888',
  },
  activeText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  activeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderLeftWidth: 4,
    borderStyle: 'solid',
    borderColor: '#5493c9',
    backgroundColor: '#fff',
    paddingLeft: 8,
    paddingRight: 8,
  },
  content: {
    flex: 1,
  },
  topBar: {
    height: 50,
  },
  list: {
    flex: 1,
  },
  item: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderStyle: 'dotted',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'transparent',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  contentDesc: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
  },
  heart: {
    width: 30,
    justifyContent: 'center',
  },
});
