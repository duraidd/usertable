import { Card } from '@mui/material';
import React from 'react'
import '../App.css';
import { useNavigate } from "react-router-dom";








function Usercard() {

    const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <Card elevation={10} onClick={()=>{navigate('/usertable')}}  sx={{width:"400px",height:"400px",cursor:"pointer",display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center','&:hover':{boxShadow:"5px 5px 50px 20px green"}}} >
          Users
        </Card>
      </header>
    </div>
  )
}

export default Usercard