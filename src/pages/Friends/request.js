import { get_author }from '../../api/author_api'
import { get_all_authors }from '../../api/author_api'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { get_followers_for_author } from '../../api/follower_api';
import { get_request } from '../../api/follower_api';
import { delete_request } from '../../api/follower_api';
import { delete_followers_for_author } from '../../api/follower_api';
import { add_followers_for_author } from '../../api/follower_api';
import { useLocation, useNavigate } from "react-router-dom";

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



function Request() {

    const user = useSelector((state) => state.user);
    const author_id = `http://localhost/authors/${user.id}/`
    const [follow_list, setList] = useState({"items": []}); 
    const [success, setSuccess] = useState(null); 
    const navigate = useNavigate();
    
    

    const location = useLocation();

    useEffect(() => { 
        get_request(user.id, setList)
      
    }, []);


    const DeleteRequest= (actor_id) => {
        delete_request(user.id, actor_id, onSuccess)
    }

    const AcceptRequest= (actor_id) => {
        add_followers_for_author(user.id, actor_id, onSuccess)
        delete_request(user.id, actor_id, onSuccess)
  }


    const onSuccess = () => {
        setSuccess(true);
    }
    
   
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
            Request
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
                key={row.actor.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.actor.id}
                </TableCell>
                <TableCell align="right">{row.actor.displayName}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color = "success"
                    onClick={(e) => AcceptRequest(row.actor.id)}
                  >
                    Accept
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color = "error"
                    onClick={(e) => DeleteRequest(row.actor.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
      </TableContainer>
     
      

      </>
    );
  }
  



export default Request;