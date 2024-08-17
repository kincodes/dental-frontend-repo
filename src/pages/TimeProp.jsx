import React from 'react'
import SparkScheduler from './SparkScheduler';

const TimeProp = (props) => {
  return (
    <div >
      <div>
  {props.showTime ? <SparkScheduler date={props.date}/> : null}
 </div>
    </div>
  )
}

export default TimeProp
