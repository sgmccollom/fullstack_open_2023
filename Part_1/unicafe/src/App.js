import { useState } from 'react'

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    );
  }
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good}/>
          <StatisticLine text="neutral" value={props.neutral}/>
          <StatisticLine text="bad" value={props.bad}/>
          <StatisticLine text="total" value={props.total}/>
          <StatisticLine text="average" value={props.average / props.total}/>
          <StatisticLine text="positive" value={(props.good / props.total) * 100}/>
        </tbody>
      </table>
    </>
  );
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (
      <>
        <tr>
          <td>{props.text}</td> 
          <td>{props.value}%</td>
        </tr>
      </>
    );
  }
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </>
  );
}

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    </>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
    setTotal(total + 1);
    setAverage(average + 1);
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
    setAverage(average + 0);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
    setTotal(total + 1);
    setAverage(average - 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average}/>
    </div>
  )
}

export default App