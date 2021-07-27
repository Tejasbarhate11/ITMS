import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { formatTime } from '../Utils/timeFormatUtil'
import secureStorage from '../Utils/secureStorage'

const QuestionCard = forwardRef((props, ref) => {

    const id = props.id
    const body= props.body
    const timeLimit = props.timeLimit
    const totalMarks = props.totalMarks
    const options = props.options
    const type = (props.type === 'multiple_ans_mcq')? 'checkbox': 'radio'

    const [time, setTime] = useState(0)

    let [selected, setSelected] = useState([])


    const handleResponse = (e)=>{
        const { value, type } = e.target;
        let options = selected
        if(type === 'checkbox'){
            if(e.target.checked){
                options.push(value)  
            }else{
                options = options.filter((item) => {
                    return item !== value
                })
            }
        }else{
            options = [value]
        }
        setSelected(options)
        console.log(selected);
    }

    const saveResponses = ()=>{
        let responses = secureStorage.getItem(process.env.REACT_APP_RESPONSE)["responses"]
        responses.push({
            question_id: id,
            selectedOptions: selected
        })
        secureStorage.setItem(process.env.REACT_APP_RESPONSE, {
            "responses": responses
        })

        setSelected([])
    }

    const resetTime=()=>{
        setTime(0)    
    }
    

    useImperativeHandle(ref, () => {
        return {
            resetTime: resetTime,
            saveResponses: saveResponses
        }
    })

    useEffect(() => {
        const timer = setInterval(()=>{
            setTime(time=>time+1)
            if(time === props.timeLimit){
                props.loadNext()
            }
        },1000)

        return ()=>{
            clearInterval(timer)
        }
    }, [props, time])



    return ( 
        <div className="container-fluid">
            <div className="question-container shadow-sm">
                <div className="question-details">
                    <p className=" float-left">Time: {formatTime(time)} / {formatTime(timeLimit)} </p>
                    <p className="float-right">Total marks: {totalMarks}</p>
                </div>
                <div className="body" dangerouslySetInnerHTML={{ __html: body}}></div>
            </div>
            <div className="options-container container shadow-sm" > 
                {
                    options.map(option => (
                        <div className="option" key={option.id}>
                            <div className="row mx-0">
                                <div className="col-sm-1 selector">
                                    <input type={type} value={option.id} name="option" defaultChecked={false} onChange={handleResponse}/>
                                </div>
                                <div className="col-sm-11">
                                    <div className="option-body" dangerouslySetInnerHTML={{ __html: option.option_body}}></div>
                                </div>
                            </div>
                        </div>   
                    ))
                }
            </div>
        </div>
    )
})
 
export default QuestionCard