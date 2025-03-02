import { useState } from "react";

const Button = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({text, val}) => {
    return <tr>
        <td>{text}</td>
        <td>{val}</td>
    </tr>
}

const Statistics = ({ good, neutral, bad, total }) => {
    if (total === 0) {
        return <div>No feedback given</div>;
    }
    return (
        <table>
            <StatisticLine text="good" val={good} />
            <StatisticLine text="neutral " val={neutral} />
            <StatisticLine text="bad " val={bad} />
            <StatisticLine text="all " val={total} />
            <StatisticLine text="average " val={(good - bad) / total} />
            <StatisticLine text="positive " val={100 * (good / total) + " %"} />
        </table>
    );
};

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    return (
        <div>
            <h1>give feedback</h1>
            <Button
                onClick={() => {
                    setGood(good + 1);
                }}
                text="good"
            />
            <Button
                onClick={() => {
                    setNeutral(neutral + 1);
                }}
                text="neutral"
            />
            <Button
                onClick={() => {
                    setBad(bad + 1);
                }}
                text="bad"
            />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} total={good + neutral + bad} />
        </div>
    );
};

export default App;
