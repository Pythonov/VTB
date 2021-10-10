import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import Rating from 'react-rating'
const AccountPage = ({user}) => {
const [person, setPerson] = useState("")
user && localStorage.setItem("person",user.name)
 const getPerson = async () => {
     const response =await axios.post("http://127.0.0.1:7070/get_single", {
        "target_class": "owner",
        "data": {
          "name": `${localStorage.getItem("person")}`
        }
    })   
    setPerson(response.data.data)  
 }   
 useEffect(()=>{
    getPerson()
    
 }, [])
    console.log(person)
    console.log(user)
    function randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
      }
    return(
        <div style = {{display:'flex', marginTop:'50px',justifyContent:'center'}}>
        { user && 
       <Card style={{ width: '18rem' }}>
       <Card.Img variant="top" src={user.picture} style={{borderRadius:"50%" }}/>
       <Card.Body>
         <Card.Title>{user.name}</Card.Title>
         <Card.Text>
           {user.email}
         </Card.Text>
       </Card.Body> 
       <ListGroup className="list-group-flush">
       {person && person.owner.map((p,index)=>(
           <div key={index}>
  <ListGroupItem >{p.name} <br/> Цена: {p.coast} Р <br/>
            <Rating readonly initialRating={p.rating/10}  /> <div>{p.rating} из 100 на основе {randomInteger(5, 20)} Покупок</div>
       { p.combine_key.map((l, index)=>
          <div key={index}><span>Ключи комбинаций:</span><div >{l.name}</div></div>  
        )}</ListGroupItem></div>
       ))}
       </ListGroup>
       
       
      
      
     </Card>}
        </div>
    
    )
}

export default AccountPage