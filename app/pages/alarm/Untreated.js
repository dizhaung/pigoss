import React, {Component} from 'react';
import {
    SafeAreaView,
    Text,
    FlatList,
    RefreshControl,
    View,
    StyleSheet,
    ActivityIndicator, TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fetchRequest from '../../api';

export default class Untreated extends Component {
  static navigationOptions = {
    title: '未处理告警',
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      total: null,
      colorMap: {
        0: '#00b300',
        2: '#0099cc',
        3: '#e6b800',
        4: '#ff8000',
        5: '#ff1a1a',
      },
      list: [],
    };
    this.start = 0;
    this.keyword = '';
  }

  // 状态清空
  clearState = () => {
    this.setState({
      refreshing: false,
      total: null,
      list: [],
    });
    this.start = 0;
  };

  // 搜索关键词
  search = async keyword => {
    this.clearState();
    this.keyword = keyword;
    await this.getList();
  };

  //获取未处理告警列表
  getList = async () => {
    this.setState({
      refreshing: this.start === 0,
    });
    try {
      const {events, totalCount} = await fetchRequest('events', 'GET', {
        start: this.start,
        isTreated: false,
        keyword: this.keyword,
      });
      this.setState({
        list: [...this.state.list, ...events],
        total: totalCount,
        refreshing: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //列表下拉刷新功能
  onRefresh = async () => {
   this.clearState();
    await this.getList();
  };

  //上拉加载
  loadingMore = async () => {
    if (this.state.total >= this.state.list.length) {
      this.start += 30;
      await this.getList();
    }
  };

  // 尾部组件
  footer = () => {
    if (this.state.refreshing) {
      return null;
    }
    if (this.state.total > 30) {
      return (
        <View>
          {this.state.total <= this.state.list.length && this.state.total ? (
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

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.list}>
          {!this.state.refreshing && this.state.list.length === 0 ? (
            <Text
              style={{
                color: '#bbb',
                fontSize: 18,
                paddingTop: 40,
                textAlign: 'center',
              }}>
              暂时没有相关数据
            </Text>
          ) : (
            <FlatList
              data={this.state.list}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  colors={['pink']}
                  progressBackgroundColor={'white'}
                  progressViewOffset={180}
                  onRefresh={this.onRefresh}
                />
              }
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                  <TouchableOpacity
                      onPress={() => navigation.navigate('AlarmDetail', item)}>
                      <View style={styles.item} key={item.id}>
                        <View style={styles.headIcon}>
                            <MaterialIcons
                                name={'error'}
                                size={25}
                                color={this.state.colorMap[item.level]}
                            />
                        </View>
                        <View style={styles.content}>
                            <Text numberOfLines={1} style={styles.title}>
                                {item.resName}
                                <Text style={styles.ip}>{item.ip}</Text>
                            </Text>
                            <Text numberOfLines={1} style={styles.desc}>
                                {item.eventDesc}
                            </Text>
                        </View>
                        <View style={styles.rightIcon}>
                            <MaterialIcons
                                name={'chevron-right'}
                                size={25}
                                color={'#bbb'}
                            />
                        </View>
                      </View>
                  </TouchableOpacity>
              )}
              onEndReachedThreshold={0.2}
              onEndReached={() => this.loadingMore()}
              ListFooterComponent={() => this.footer()}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dee',
  },
  headIcon: {
    width: '10%',
    paddingLeft: 10,
  },
  rightIcon: {
    width: '10%',
  },
  content: {
    width: '80%',
    paddingLeft: 10,
  },
  title: {
    fontSize: 15,
    color: '#1c2438',
  },
  ip: {
    fontSize: 14,
    color: '#80848f',
  },
  desc: {
    fontSize: 12,
  },
});
