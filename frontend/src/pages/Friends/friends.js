//import './friends.css';
import { get_authors }from '../../api/author_api'
import { useEffect, useState } from "react";
import { Navigate, Route, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { add_followers_for_author } from '../../api/follower_api';

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function Friends() {

    const { author_id } = useParams();
    const [author, setAuthor] = useState({});
    const [follow_list, setList] = useState({"items": []}); 
    const [success, setSucess] = useState(null); 

    let page = 1
  
    useEffect(() => { 
      get_author(`http://localhost/authors/${author_id}/`, setAuthor);
  
      get_authors(page,setList)
      
  
    }, []);

  
    const followAuthor= (follow_id) => {

        add_followers_for_author(`http://localhost/authors/${author_id}`,follow_id, setSucess(true))
    }
    
    const page_buttons = () => {
        if (user_list.items.length < 5 && page == 1)
        {
          return;
        } 
        else if (page == 1)
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
        get_authors(page,setList)
      };
    
    const back_page = () => {
        page = page - 1;
        get_authors(page,setList)
      };
  
  
    return (
        <>
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
                <TableCell align="right">{row.displayname}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={followAuthor(row.id)}
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