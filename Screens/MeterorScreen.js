import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, Platform, StatusBar, ImageBackground, Image, Dimensions } from 'react-native';
import axios from 'axios';

export default class MeterorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: {},
    };
  }
  componentDidMount() {
    this.getMeteors();
  }

  getMeteors = () => {
    axios
      .get(
        'https://api.nasa.gov/neo/rest/v1/feed?api_key=R4On5KryjRjhzfC9iJBo3UThj67K2kCV2Q168Jpe'
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  
  renderItem=({item})=>{
  let meteor=item
  let bgImage,speed,size
  
  if(meteor.threat_score<=30){
  bgImage=require("../assets/meteor_bg1.png")
  speed=require("../assets/meteor_speed3.gif")
  size=100
  }
  else if(meteor.threat_score<=75){
  bgImage=require("../assets/meteor_bg2.png")
  speed=require("../assets/meteor_speed3.gif")
  size=150
  }
  else{
  bgImage=require("../assets/meteor_bg3.png")
  speed=require("../assets/meteor_speed3.gif")
  size=200
}
return(
<View>
<ImageBackground source={bgImage}
style={styles.backGroundImage}>
<View style={styles.gifContainer}>
<Image source={speed}style={{
width:size,height:size, alignSelf:'center'}}></Image>
<View>
<Text style={[styles.cardTitle,{marginTop:400,marginLeft:50}]}>{item.name}</Text>

<Text style={[styles.cardText,{marginTop:20,marginLeft:50}]}>Closest to Earth-{item.close_approach_data[0].close_approach_date_full}</Text>

<Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>Minimum Diameter(KM)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>

<Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>Maximum Diameter(KM)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>

<Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>Velocity(KM/H)-{item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>

<Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>Missing Earth By(KM)-{item.close_approach_data[0].miss_distance.kilometers}</Text>

</View>
</View>
</ImageBackground>
</View>
)
  }
    keyExtractor=(item,index)=>index.toString();
  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    } else {
      let meteorArray = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });
      
      let meteors = [].concat.apply([], meteorArray);
      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatScore;
      });
      meteors.sort(function(a,b){
      return b.threat_score-a.threat_score
      })
      meteors=meteors.slice(0,5)
      return (
        <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea}/>
        <FlatList 
        keyExtractor={this.keyExtractor}
        data={meteors}
        renderItem={this.renderItem}
        //horizontal={true}
        />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backGroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    cardText: {
        color: "white"
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
});