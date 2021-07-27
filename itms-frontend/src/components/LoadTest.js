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
  


const LoadTest = () => {

    const classes = useStyles()
    const  history = useHistory()

    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() =>{
        setDownloading(true)
        fetch('/examinee/test/data')
        .then(response => {
            if(!response.ok){
                throw Error('Some error occurred while downloading the question paper!')
            }else{
                return response.json()
            }
        })
        .then(data => {
            if(data.success){
                setDownloading(false)
                secureStorage.setItem(process.env.REACT_APP_QUESTIONS, data.test["Questions"])
                secureStorage.setItem(process.env.REACT_APP_TOTAL_MARKS, data.test["total_score"])
                secureStorage.setItem(process.env.REACT_APP_RESPONSE, {
                    responses: [] 
                })
                secureStorage.setItem(process.env.REACT_APP_STATUS, 'started')
                history.replace("/test/start")
            }else{
                setDownloading(false)
                alert("Error loading the test. Please refresh the page")
            }
        }).catch(err => {
            setDownloading(false)
            setError(err.message)
        })
    }, [history])

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
     )
}
 
export default LoadTest