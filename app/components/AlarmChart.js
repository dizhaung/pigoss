import React, {Component} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {VictoryPie, VictoryLegend} from 'victory-native';

export default class AlarmChart extends Component {
  constructor(props) {
    super(props);
  }

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
    const colorScale = ['#ff1a1a', '#ff8000', '#e6b800', '#0099cc'];
    return (
        <View style={styles.container}>
          {this.props.data && this.props.data.length === 0 ? (
              <ActivityIndicator size="small" color="#46BAEC" />
          ) : (
              <View style={styles.wrapper}>
                <View style={styles.chart}>
                  <View style={styles.label}>
                    <Text style={styles.count}>{this.props.count}</Text>
                    <Text style={styles.title}>{this.props.title}</Text>
                  </View>
                  {this.props.data.reduce((pre, cur) => pre + cur) === 0 ? (
                      <VictoryPie
                          animate={{
                            onExit: {
                              duration: 10,
                            },
                          }}
                          padding={36}
                          colorScale={['#00b300']}
                          innerRadius={60}
                          data={[1]}
                          height={250}
                          labels={() => ''}
                      />
                  ) : (
                      <VictoryPie
                          animate={{
                            onExit: {
                              duration: 10,
                            },
                          }}
                          padding={36}
                          colorScale={colorScale}
                          innerRadius={60}
                          data={this.props.data}
                          height={250}
                          labels={() => ''}
                      />
                  )}
                </View>
                <View style={styles.legend}>
                  <VictoryLegend
                      width={120}
                      height={115}
                      centerTitle
                      orientation="vertical"
                      gutter={20}
                      style={{
                        border: {stroke: 'transparent'},
                        labels: {fill: 'white'},
                      }}
                      data={this.props.legend}
                  />
                </View>
              </View>
          )}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d283d',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chart: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
  },
  count: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
