import React from "react";

const Input = ({queryText,setQueryText}) => {
return (
    <input placeholder="Введите запрос от 4-х символов" value={queryText}
        onChange={e=> setQueryText(e.target.value)}
        style = {{width:"auto", margin:"25px"}}
    ></input>
)
}

export default Input