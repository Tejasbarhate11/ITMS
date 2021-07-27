import React from 'react'
import { useState, useEffect, useRef } from 'react'
import QuestionCard from './QuestionCard'
import { Typography } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import {useSessionStorage} from '../Hooks/useSessionStorage'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from "react-router-dom"
import { useFullScreen } from 'react-browser-hooks'
import { useBeforeunload } from 'react-beforeunload'
import secureStorage from '../Utils/secureStorage'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: '0px',
        height: '100%'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
      backdropmsg: {
          color: '#000',
          marginLeft: '10px'
      }
}))

const TestPage = () => {


    const ref = useRef(null)
    const classes = useStyles()
    const  history = useHistory()

    const [questions] = useSessionStorage(process.env.REACT_APP_QUESTIONS, null)
    const [current, setCurrent] = useState(secureStorage.getItem(process.env.REACT_APP_CURRENT)||0)

    const { toggle, fullScreen } = useFullScreen()

    const [start, setStart] = useState(false)
    const [saving, setSaving] = useState(false)
    const [backdrop_msg, setBackdropMsg] = useState("Test starting in 3 seconds...")

    const [isCompleted, setIsCompleted] = useState(false)


    useBeforeunload((event) => {
        if (!isCompleted) {
          event.preventDefault()
        }
    }) 


    const loadNext = ()=>{
        setSaving(true)
        setBackdropMsg("Saving response...")
        ref.current.saveResponses()
        if(current < questions.length-1){
            setSaving(false)
            ref.current.resetTime()
            setCurrent(current+1)
            secureStorage.setItem(process.env.REACT_APP_CURRENT, current)
        }else{
            setIsCompleted(true)
            secureStorage.setItem(process.env.REACT_APP_STATUS, 'completed')
            submitTest()
        }
    }

    const submitTest = () => {
        history.replace("/test/submit")
    }

    useEffect(() => {
        const timer = setTimeout(()=>{
            setStart(true)
        }, 3000)

        return ()=>{
            clearTimeout(timer)
        }
    }, [])

    return ( 
        <div className={classes.root}>
            <Backdrop className={ classes.backdrop } open={ !start || saving }>
                <CircularProgress color='primary'/>
                <Typography
                    display='block'
                    className={classes.backdropmsg}
                >
                    { backdrop_msg }
                </Typography>
            </Backdrop>
            <Backdrop className={ classes.backdrop } onClick={toggle} open={ !fullScreen && start }>
                <CircularProgress color='primary'/>
                <Typography
                    display='block'
                    className={classes.backdropmsg}
                >
                    Return to fullscreen by clicking anywhere on the screen (Don't use F11)
                </Typography>
            </Backdrop>
            {start &&
                <div className="container-fluid">
                    <div className="submit-container">
                        <button className="btn btn-success float-right" onClick={submitTest}>Submit test</button>
                    </div>
                </div>
            }

            {start &&
            <QuestionCard 
                id={questions[current].id}
                body={questions[current].question_body} 
                timeLimit={questions[current].time_limit} 
                totalMarks={questions[current].total_score} 
                ref={ref}
                loadNext={loadNext}
                type={questions[current].type} 
                options={questions[current]["Options"]}
            />
            }
            {start &&
                <div className="container-fluid">
                    <div className="btn-container container">
                        <button className="btn btn-primary float-right" onClick={loadNext}>Next</button>
                    </div>
                </div>
            }
        </div>
     )
}
 
export default TestPage