import React from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';

var fetchData = require("../fetchData");

export default class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(props) {
    super(props);
    this.state = {myMap: false}
    this.listenerIndex = null;
  }

  async componentDidMount(){
    let map = await this.props.navigation.state.params.mapGenerator()
    this.setState({
      myMap: map
    })
    this.listenerIndex = fetchData.MapEventListeners.push(async () => {let map = await this.props.navigation.state.params.mapGenerator(); this.setState({myMap: map})})-1
    console.log("i'm alive")
  }

  componentWillUnmount(){
    fetchData.MapEventListeners[this.listenerIndex] = undefined
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <ScrollView style={styles.container}>
        <Button
          title="Check Accuracy"
          onPress={() =>
            navigate('Accuracy', {'name': 'Check Accuracy', 'asrTextGetter': this.props.navigation.state.params.asrTextGetter})
          }
        />
        {this.props.navigation.state.params.resultcells}
        {this.state.myMap}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
});
