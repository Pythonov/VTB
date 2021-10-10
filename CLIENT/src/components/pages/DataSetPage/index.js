import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from 'axios'
import { Table,Button } from "react-bootstrap";

const DataSetPage = () => {
    const [data, setData] = useState();
    const [dataset, setDataset] = useState();
    const params = useParams()
    const [fields, setFields] = useState([
    "fieldPath",
    "nullable",
    " description",
    "nativeDataType",
  ]);

  const [combineRows, setCombineRows] =useState([
])
const [combine, setCombine] = useState()
//mock data
  const [kafka, setKafka] = useState()
  const getData = async () => {
    const response = await axios.post("http://127.0.0.1:7070/get_datasets", {
      query: {
        query: `${params.name} `,
        start: 0,
        count: 1,
        fields: fields,
      },
      settings: {
        url: "http://localhost:8080/api/graphql",
      },
    });
    setData(response.data.answer.data.search.searchResults[0].entity);
  };
  //mockdata
  const getKafka = async () => {
    const response = await axios.post("http://127.0.0.1:7070/get_datasets", {
      query: {
        query: "SampleKafkaDataset",
        start: 0,
        count: 1,
        fields: fields,
      },
      settings: {
        url: "http://localhost:8080/api/graphql",
      },
    });
    setKafka(response.data.answer.data.search.searchResults[0].entity);
  };
  const getDataset = async () => {
    const response = await axios.post("http://127.0.0.1:7070/get_single", {
        
            "target_class": "dataset",
            "data": {
              "name": `${params.name}`
            }
          
    });
    setDataset(response.data);
  };
//Доделать выборку по combine_key
  const getCombine = async () => {
    const response = await axios.post("http://127.0.0.1:7070/get_single", {
        "target_class": "dataset",
        "data": {
          "name": "SampleKafkaDataset"
        }
      
          
    });
    setCombine(response.data);
  };
  const createRow = (newRow)=>{
    setCombineRows([...combineRows, newRow])
    console.log(combineRows)
    console.log(newRow)
  }

  const AddNewRow = (field) => {
        
      createRow(field)
  }


  useEffect(()=>{
    getData()
    getDataset()
    getCombine()
    getKafka()
  }, [])

//   console.log('Из датахаба:',data)
   console.log('Из kafka:',kafka)
    return (
        <>
       <div style = {{display:'flex', justifyContent:'center'}}>
       { (data && dataset) ? (<><Table striped bordered hover style = {{margin:"25px"}}>
       <thead>
    <tr>
      <th>Название датасета</th>
      <th>Владелец</th>
      <th>Рейтинг</th>
      <th>Стоимость</th>
      <th>Ключ комбинирования</th>
    </tr>
  </thead>
  <tbody>
    <tr valign="middle" style={{textAlign: "center"}}>
        <td ><strong>{data.name}</strong></td>
      <td>{dataset.data.owner.name}</td>
      <td>{dataset.data.rating}</td>
      <td>{dataset.data.coast} Р</td> 
      <td>{dataset.data.combine_key[0].name}</td> 
     
    </tr>
   
  </tbody>
       </Table>
       
       <Table striped bordered hover style = {{margin:"25px"}}>
       <thead>
    <tr>
      <th>Названия полей</th>
      <th>Описание</th>
      <th>Тип данных</th>
      <th>Добавить</th>
     
    </tr>
  </thead>
  <tbody>
        {data.schema.fields.map((field,index)=>(
            <tr key = {index}>
                <th>{field.fieldPath}</th>
                <th>{field.description}</th>
                <th>{field.nativeDataType}</th>
                <th style={{display:'flex', justifyContent:'center'}}><Button onClick={()=>AddNewRow(field)}>+</Button></th>
            </tr>
        ))}
        
  </tbody>
       </Table>
       
       
       </>) : <div>Загрузка...</div>}
     
       </div>
       <div>
       <h2 style={{display:'flex', justifyContent:'center'}}>Доступные для комбинирования датасеты</h2>


       <div style = {{display:'flex', justifyContent:'center'}}>
       { (combine) ? (<><Table striped bordered hover style = {{margin:"25px"}}>
       <thead>
    <tr>
      <th>Название датасета</th>
      <th>Владелец</th>
      <th>Рейтинг</th>
      <th>Стоимость</th>
      <th>Ключ комбинирования</th>
    </tr>
  </thead>
  <tbody>
    <tr valign="middle" style={{textAlign: "center"}}>
        <td ><strong>{combine.data.name}</strong></td>
      <td>{combine.data.owner.name}</td>
      <td>{combine.data.rating}</td>
      <td>{combine.data.coast} Р</td> 
      <td>{combine.data.combine_key[0].name}</td> 
     
    </tr>
   
  </tbody>
       </Table>
       
       <Table striped bordered hover style = {{margin:"25px"}}>
       <thead>
    <tr>
       
      <th>Названия полей</th>
      <th>Описание</th>
      <th>Тип данных</th>
      <th>Добавить</th>
     
    </tr>
  </thead>
  <tbody>
        {kafka.schema.fields.map((field,index)=>(
            <tr key = {index}>
                <th>{field.fieldPath}</th>
                <th>{field.description}</th>
                <th>{field.nativeDataType}</th>
                <th style={{display:'flex', justifyContent:'center'}}><Button onClick={()=>AddNewRow(field)}>+</Button></th>
            </tr>
        ))}
        
  </tbody>
       </Table>
       
       
       </>) : <div>Загрузка...</div>}
     
       </div>



 

























       <h2 style={{display:'flex', justifyContent:'center'}}>Готовый датасет</h2>
      
       {combineRows && 
       <Table striped bordered hover style = {{margin:"25px"}}>
       <thead>
    <tr>
   
      <th>Названия полей</th>
      <th>Описание</th>
      <th>Тип данных</th>
      
     
    </tr>
  </thead>
  <tbody>
        {combineRows.map((field,index)=>(
            <tr key = {index}>
                
                <th>{field.fieldPath}</th>
                <th>{field.description}</th>
                <th>{field.nativeDataType}</th>
            </tr>
        ))}
        
  </tbody>
       </Table>}
       <div style={{display:'flex', justifyContent:'center'}}> <Button >Выгрузить</Button></div>
      
       </div>
       
       </>
    )
}

export default DataSetPage