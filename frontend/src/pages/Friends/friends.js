//import './friends.css';
import { get_authors }from '../../api/author_api'
import { get_author }from '../../api/author_api'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { add_followers_for_author } from '../../api/follower_api';
import { useNavigate } from "react-router-dom";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';



function Friends() {

    const user = useSelector((state) => state.user);
    const author_id = `http://localhost/authors/${user.id}/`
    const [author, setAuthor] = useState({});
    const [follow_list, setList] = useState({"items": []}); 
    const [success, setSucess] = useState(null); 
    const navigate = useNavigate();
    

    
    var page = 1;

    useEffect(() => { 
      get_author(`http://localhost/authors/${user.id}/`, setAuthor);
  
      get_authors(page,setList)
      
  
    }, []);

  
    const followAuthor= (follow_id) => {

        add_followers_for_author(user.id, follow_id, onSuccess)
    }

    const onSuccess = () => {
        setSucess(true);
    }
    
    const page_buttons = () => {

    /*  need fix here!
 
        if (follow_list.items.length < 5 && page == 1)
        {
          return;
        }
         
        if (page == 1)
        {
            return (<button onClick={forward_page}>Next Page</button>);
        } 
        else if (follow_list.items.length < 5)
        {
          return <button onClick={back_page}>Prev Page</button>
        } 
        else 
        {
          return (
          <div>
            <button onClick={back_page}>Prev Page</button>
            <button onClick={forward_page}>Next Page</button>
          </div>);
        }
        */
         
        return (
            <div>
              <button onClick={back_page}>Prev Page</button>
              <button onClick={forward_page}>Next Page</button>
            </div>);
       
      };


    const forward_page = () => {
        page = page + 1;
        get_authors(page,setList)
        
      };
    
    const back_page = () => {
        if (page == 1)
        {
            page=page + 1;
        } 
        page = page - 1;
        get_authors(page,setList)
        
      };
    
    const goBack = () => {
        navigate("/");
        
      };
  
  
    return (
        
        <>
        <div>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Button
                variant="contained"
                onClick={goBack}
                >
                back
            </Button>
          <Typography variant="h6" align="left" color="inherit" component="div">
            Add friends
          </Typography>
          </Toolbar>
        </AppBar>
        </Box>
        </div>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Follow</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {follow_list.items.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.displayName}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={(e) => followAuthor(row.id)}
                  >
                    follow
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
      </TableContainer>
      <div style={{ width: "100%", textAlign: "center", paddingTop: 16 }}>
          {page_buttons()}
      </div>
      

      </>
    );
  }
  



export default Friends;