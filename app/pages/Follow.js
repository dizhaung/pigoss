import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import fetchRequest from '../api';
import {NavigationEvents} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class Follow extends Component {
  static navigationOptions = {
    title: '我的关注',
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      list: [],
      refreshing: true,
    };
    this.start = 0;
    this.keyword = '';
    this.isContinue = true;
  }
  handleChange = text => {
    this.setState({
      value: text,
    });
  };
  //按下enter键触发搜索
  onSearch = () => {
    this.setState({
      list: [],
    });
    this.start = 0;
    this.getList(this.state.value);
  };
  // 聚焦该页面获取接口数据
  onWillFocus = async () => {
    await this.getList();
  };
  onWillBlur = async () => {
    this.setState({
      value: '',
      list: [],
      refreshing: false,
    });
    this.start = 0;
    this.isContinue = true;
  };
  // 获取关注列表
  getList = async keyword => {
    this.keyword = keyword ? keyword : '';
    this.setState({
      refreshing: this.start === 0,
    });
    const params = keyword
      ? {start: this.start, isAttned: 1, keyword}
      : {start: this.start, isAttned: 1};
    try {
      const data = await fetchRequest('/monitors/res', 'GET', params);
      this.isContinue = data.length !== 0;
      this.setState({
        list: [...this.state.list, ...data],
        refreshing: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  followChange = async item => {
    let obj = {isAttned: item.isAttned === '0' ? '1' : '0'};
    try {
      const data = await fetchRequest('monitors/res', 'PUT', {
        path: item.path,
        params: JSON.stringify(obj),
      });
      if (data) {
        alert('取消关注成功')
        this.setState({
          refreshing:true,
          list:[],
        })
        this.start = 0
        this.isContinue = true;
        this.getList()
      }
    } catch (e) {
      alert('取消关注失败');
      console.log(e);
    }
  };
  //列表下拉刷新功能
  onRefresh = async () => {
    this.setState({
      value:'',
      list: [],
      refreshing: true,
    });
    this.start = 0;
    await this.getList();
  };
  //上拉加载
  loadingMore = async () => {
    if (this.isContinue) {
      this.start += 30;
      await this.getList(this.keyword);
    }
  };
  // 尾部组件
  footer = () => {
    if (this.state.refreshing) {
      return null;
    }
    if (this.state.list.length > 0) {
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
      <SafeAreaView style={{flex: 1, backgroundColor: 'whitesmoke'}}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
        />
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
            {/*<TouchableOpacity style={styles.button}>*/}
            {/*  <Text style={{fontSize: 16}}>添加关注</Text>*/}
            {/*</TouchableOpacity>*/}
          </View>
          <View style={styles.list}>
            {/*{this.state.list.length === 0 ? (*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      color: '#bbb',*/}
            {/*      fontSize: 18,*/}
            {/*      paddingTop: 40,*/}
            {/*      textAlign: 'center',*/}
            {/*    }}>*/}
            {/*    暂时没有相关数据*/}
            {/*  </Text>*/}
            {/*) : (*/}
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
              ListFooterComponent={() => this.footer()}
              onEndReached={() => this.loadingMore()}
              renderItem={({item}) => (
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
                    <View style={styles.content}>
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
                      <Text style={styles.path}>{item.parentAlias}</Text>
                    </View>
                    <View style={styles.heart}>
                      {/*{item.isAttned == 1 ? (*/}
                      <MaterialIcons
                        name={'favorite'}
                        size={15}
                        color={item.isAttned == 1 ? '#469cd1' : '#aaa'}
                        onPress={() => this.followChange(item)}
                      />
                      {/*) : null}*/}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
            {/*)}*/}
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
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'relative',
    // backgroundColor: 'yellow',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
  },
  path: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    fontSize: 12,
    color: '#bbb',
  },
  heart: {
    width: 30,
    justifyContent: 'center',
  },
});
