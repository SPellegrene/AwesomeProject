import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, TextInput, ListView, View, Image, Alert } from 'react-native';
import axios from 'axios';

function api() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://bestbuy.now.sh';
  } else {
    return'http://localhost:3030';
  }
};

export default class AwesomeProject extends Component {
  constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        text: '',
        stores: [] //ds.cloneWithRows([])
      };
    }

    componentDidMount() {
    this.getProducts()
  }

    getProducts(){
      //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      axios.get(api() + '/stores').then((response)=> {
        let stores = response.data.data.slice(0);
        this.setState({
        stores
      })
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  onNewSearchName(text){
      this.setState({
        newItemValue: text
      })
    }

    onSearchSubmit(e) {
      e.preventDefault();
      axios.get(api() + '/stores?name[$like]=*' + this.state.newItemValue + '*&$sort[price]=-1&$limit=50')
      .then((response) => {
        let newStores = response.data.data.slice(0);
        this.setState({
          stores: newStores,
          newItemValue: ''
        })
      }).catch(function (error) {
        console.log(error);
      });
    }


  getStoresRows(){
    let ds = this.getStoresDataSource();
    return ds.cloneWithRows(this.state.stores);
  }

  getStoresDataSource(){
    return new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  // whenChanged(field, e) {
  //       var change = {};
  //       change[field] = e.target.value;
  //       this.setState(change);
  //     }

  render() {
      return (
        <View style={{backgroundColor:'skyblue', alignItems:'center'}}>
          <View
          style={{
            marginTop:35,
            alignItems:'center'
          }}>
            <Text style={{color:'white', fontSize:22}}>Best Buy</Text>
            </View>
            <View onSubmit={this.onSearchSubmit.bind(this)} >
            <TextInput onChangeText={this.onNewSearchName.bind(this)} value={this.state.newItemValue} placeholder="Search Store Here"
            style={{
              height: 40,
              width:150,
              marginTop:10,
              borderWidth:1,
              borderRadius:5,
              borderColor:'white',
              color:'white',
            }}
            onSubmitediting={this.onSearchSubmit.bind(this)} />
          </View>
          <ListView style={{marginTop:15}} enableEmptySections={true} dataSource={this.getStoresRows()}
            renderRow={(rowData)=>
              <View
              style={{
                // borderWidth:1,
                borderRadius:3,
                marginBottom:15,
                alignItems:'center',
                backgroundColor:'white',
                width:200
               }}>
                <Text style={{fontWeight:'600'}}>{rowData.name}</Text>
                <Text>{rowData.address}</Text>
                <Text style={{marginTop:10,fontSize:12, alignItems:'center'}}>{rowData.hours}</Text>
              </View>
            }
            />

        </View>
    );
  }
}
AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
// AppRegistry.registerComponent('EnterWords', () => EnterWords);
