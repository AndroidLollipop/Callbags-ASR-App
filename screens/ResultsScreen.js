import React from 'react';
import { ScrollView, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';

import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

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
    this.state = {myMap: false, cells: false, myHighlight: false, myPathHighlight: false}
    this.listenerIndex = null;
    this.listenerIndey = null;
    let {height, width} = Dimensions.get("window");
    this.height = height;
    this.width = width;
  }

  async componentDidMount(){
    this.listenerIndex = fetchData.MapEventListeners.push(() => {let hil = this.props.navigation.state.params.highlightGetter(); let phi = this.props.navigation.state.params.pathHighlightGetter(); this.setState({myHighlight: hil, myPathHighlight: phi})})-1
    this.listenerIndey = fetchData.RefEventListeners.push(async (stageCompletion) => {let cells = await this.props.navigation.state.params.cellsGetter(stageCompletion); this.setState({cells: cells})})-1
    let cells = this.props.navigation.state.params.resultcells
    let map = this.props.navigation.state.params.mapGenerator()
    let hil = this.props.navigation.state.params.highlightGetter()
    let phi = this.props.navigation.state.params.pathHighlightGetter()
    this.setState({
      cells: cells,
      myHighlight: hil,
      myPathHighlight: phi
    })
    this.setState({
      myMap: await map,
    })
  }

  componentWillUnmount(){
    fetchData.MapEventListeners[this.listenerIndex] = undefined
    fetchData.RefEventListeners[this.listenerIndey] = undefined
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
        {this.state.cells}
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.props.navigation.state.params.mapCanvasOP}
          >
          <Svg
            height={this.width}
            width={this.width}
          >
          {this.state.myMap}
          {this.state.myHighlight}
          {this.state.myPathHighlight}
          </Svg>
        </TouchableOpacity>
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
