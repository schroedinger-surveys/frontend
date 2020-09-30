import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {sortQuestions} from "../../utils/SortQuestions";

const Submissions = (props) => {
    const [pieChart, setPieChart] = useState(true);
    const [barGraph, setBarGraph] = useState(false);

    const [allQuestions, setAllQuestions] = useState([]);

    const setVisibility = (name) => {
        if (name === "pie"){
            setPieChart(true);
            setBarGraph(false);
        } else if (name === "bar"){
            setPieChart(false);
            setBarGraph(true);
        }
    }

    useEffect(() => {
        setAllQuestions(sortQuestions(props.selectedSurvey.constrained_questions, props.selectedSurvey.freestyle_questions));
    }, [props.selectedSurvey]);

    return (
        <div>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: pieChart ? "orange" : "grey"}} onClick={() => setVisibility("pie")}>Pie Chart</button>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: barGraph ? "orange" : "grey"}} onClick={() => setVisibility("bar")}>Bar Graph</button>
            <div>
                {pieChart && (
                    <h3>This is the Pie Chart</h3>
                )}
                {barGraph && (
                    <h3>This is the Bar Graph</h3>
                )}
            </div>
            <div>
                {allQuestions.map((item, i) => (
                    <div key={i} style={{width: "100%", border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                        <label style={{cursor: "pointer"}}>Question {i+1}: <span style={{fontWeight: "bold"}}>{item.question.question_text}</span> - <i style={{color: "grey"}}>click to see visual representation</i></label>
                    </div>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(Submissions);