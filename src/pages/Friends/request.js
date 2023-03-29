import "./friends.css";

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
import Sidebar from '../../components/Sidebar/sidebar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';



function Request() {

  const user = useSelector((state) => state.user);
  const [follow_list, setList] = useState({"items": []}); 
  const [success, setSuccess] = useState(null); 
  const navigate = useNavigate();
  

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

  let page = 1;
  const page_buttons = () => {

    if (follow_list.items.length < 5 && page === 1)
    {
      return;
    }
    if (page === 1)
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
  };


  const forward_page = () => {
      page = page + 1;
      navigate(`/friends/?page=${page}`);
      navigate(0)
    };
  
  const back_page = () => {
      page = page - 1;
      navigate(`/friends/?page=${page}`);
      navigate(0)
    };
  
  
    return (
        
        <>
        <Sidebar />
        <div className="sidebar-offset">
          <div>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense" className="table-head">
          <Typography variant="h6" align="left" color="inherit" component="div">
            Requests
          </Typography>
          <Button
                variant="contained"
                id="back"
                onClick={goBack}
                >
                back
            </Button>
          </Toolbar>
        </AppBar>
        </Box>
        </div>
        <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className="table">
          <TableHead className="table-titles">
            <TableRow>
              <TableCell id="title">ID</TableCell>
              <TableCell id="title" align="right">Name</TableCell>
              <TableCell id="title" align="right"></TableCell>
              <TableCell id="title" align="right"></TableCell>
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
     <div style={{ width: "100%", textAlign: "center", paddingTop: 16 }}>
          {page_buttons()}
      </div>
      </div>
      

      </>
    );
  }
  



export default Request;