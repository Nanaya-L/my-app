import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid"
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Main(){

    const [height,setHeight] = useState(0)
    const [weight,setWeight] = useState(0)
    
    const imcListGet = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@imcList')              
          return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch(e) {
            console.log(e);
        }
    }
    const imcListSet = async (imcList:any[]) => {
        try {
            const jsonValue = JSON.stringify(imcList)                                        
            await AsyncStorage.setItem('@imcList',jsonValue)
        } catch (error) {
            console.log(error);
        }
    }

    const [allIMC, setAllIMC] = useState()

    const getStorage = async() => {
        const jsonValue = await AsyncStorage.getItem('@imcList')
        setAllIMC(jsonValue != null ? JSON.parse(jsonValue) : [])
    }              
    useEffect(()=>{
        getStorage()
    },[])

    async function calculaIMC(){
        const imc = Number(((weight / (height * height))* 10000).toFixed(2))


        const imcList = await imcListGet()
        
        if(imc > 0) {
            imcList.push({date: new Date().toLocaleDateString(), imc: imc})
            if(imcList.length>5){
                imcList.shift()
            }
            setAllIMC(imcList)     
            await imcListSet(imcList)
        }
    }

    function listContructor({list}:{list:any[]}){
        return list.map((item)=> (
        <View style={styles.listBody}>
            <Text style = {styles.content} key={uuidv4()}>data: {item.date}</Text>
            <Text style = {styles.content} key={uuidv4()}> imc: {item.imc} </Text>
        </View>
        ))
    }

    return(
    <View style={styles.container}>
      <Text style = {styles.top} >Calculadora de IMC 2.0</Text>
      <Text style = {styles.under}>Dessa vez feita em EXPO</Text>
      <View style = {styles.inputs}>
      <TextInput textAlign='center' onChangeText={newText=> setHeight(Number(newText))} keyboardType='numeric' maxLength={3} placeholder='Digite sua altura em cm aqui...' placeholderTextColor={'#C7C0BE'} style = {styles.input} ></TextInput>
      <TextInput textAlign='center' onChangeText={newText=> setWeight(Number(newText))} keyboardType='numeric' maxLength={3} placeholder='Digite seu peso em kg aqui...' placeholderTextColor={'#C7C0BE'} style = {styles.input}></TextInput>
      <Button title='Calcular IMC' color={'purple'} onPress={calculaIMC}></Button>
      </View>
      <View style = {styles.totalList}>
      <Text style = {styles.headerList}>Últimos cinco registros de IMC</Text>
      {listContructor({list:allIMC?allIMC:[]})}
      </View>
      <StatusBar style="auto" />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 100,
      justifyContent: 'flex-start',
    },
    top:{
        fontSize: 20,
        fontWeight: 'bold'
    },
    under:{
        color: '#9E9492'
    },
    inputs:{
        marginTop: 50,
    },
    input:{
        marginTop: 5,
        marginBottom: 10,
        borderColor: '#901281',
        borderWidth: 1,
        borderRadius:20,
        padding: 7,
    },
    headerList:{
        marginTop: 20,
        marginBottom: 12,
        fontWeight: 'bold',
        alignSelf: 'center'    
    },
    listBody:{
        alignItems: 'center',
        flexDirection: 'row',
    },
    content: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom:17
    },
    totalList: {
        borderColor: '#901281',
        borderWidth: 2,
        borderRadius: 25,
        marginTop:100,
        paddingBottom:10,
        paddingRight:8,
        paddingLeft:8
    }
  });