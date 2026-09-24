import React from 'react'
import Text from './Text'
import InputBox from './InputBox'
import StatsBox from './StatsBox'

const ReportProblem = ({ onSubmitted }) => {
  return (
    <div>
        <Text/>
        <InputBox onSubmitted={onSubmitted}/>
        <StatsBox/>
    </div>
  )
}

export default ReportProblem