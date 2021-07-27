import React from 'react'
import { Typography } from '@material-ui/core'
import { useState, useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from "react-router-dom"
import secureStorage from '../Utils/secureStorage'

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    backdropmsg: {
        color: '#000',
        marginLeft: '10px'
    }
}))
  

const SubmitPage = () => {

    const classes = useStyles()
    const  history = useHistory()

    const [ submitting, setSubmitting] = useState(false)

    useEffect(() =>{
        setSubmitting(true)
        fetch('/examinee/test/submit', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: secureStorage.getItem(process.env.REACT_APP_STATUS),
                reponse: secureStorage.getItem(process.env.REACT_APP_RESPONSE)
            })
        })
        .then(response => {
            if(!response.ok){
                throw Error('Some error occurred while submitting the test response!');
            }else{
                return response.json()
            }
        })
        .then(data => {
            setSubmitting(false)
            if(data.success){
                secureStorage.clear()
                history.replace("/")
            }else{
                alert(data.message)
            }
        }).catch(err => {
            setSubmitting(false)
        })
    }, [history])

    return ( 
        <div>
            <Backdrop className={ classes.backdrop } open={ submitting }>
                <CircularProgress color='primary'/>
                <Typography
                    display='block'
                    className={classes.backdropmsg}
                >
                    Submitting answers...
                </Typography>
            </Backdrop>
        </div>
     )
}
 
export default SubmitPage;