import React from 'react';
import { Button, Typography } from '@material-ui/core'
import { useState, useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    backdropmsg: {
        color: '#000',
        marginLeft: '10px'
    }
}));
  


const TestPage = () => {

    const classes = useStyles();

    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() =>{
        setDownloading(true)
        fetch('/examinee/test/data')
        .then(response => {
            if(!response.ok){
                throw Error('Some error occurred while downloading the question paper!');
            }else{
                return response.json()
            }
        })
        .then(data => {
            if(data.success){
                setDownloading(false);
                localStorage.setItem('data', JSON.stringify(data));
            }
        }).catch(err => {
            setDownloading(false);
            setError(err.message);
        }) 
    }, [])

    return ( 
        <div>
            {error && <div className="alert alert-danger text-center">
                {error}
            </div>}
            <Backdrop className={ classes.backdrop } open={ downloading }>
                <CircularProgress color='primary'/>
                <Typography
                    display='block'
                    className={classes.backdropmsg}
                >
                    Downloading question paper...
                </Typography>
            </Backdrop>
        </div>
     );
}
 
export default TestPage;