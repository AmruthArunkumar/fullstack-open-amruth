import Course from "./components/Course";

const App = () => {
    const course = [
        {
            id: 1,
            name: "Half Stack application development",
            parts: [
                {
                    id: 1,
                    name: "Fundamentals of React",
                    exercises: 10,
                },
                {
                    id: 2,
                    name: "Using props to pass data",
                    exercises: 7,
                },
                {
                    id: 3,
                    name: "State of a component",
                    exercises: 14,
                },
                {
                    id: 4,
                    name: "Redux",
                    exercises: 11,
                },
            ],
        },
        {
            name: "Node.js",
            id: 2,
            parts: [
                {
                    name: "Routing",
                    exercises: 3,
                    id: 1,
                },
                {
                    name: "Middlewares",
                    exercises: 7,
                    id: 2,
                },
            ],
        },
    ];

    return (
        <div>
            {course.map((e) => (
                <Course course={e} key={e.id} />
            ))}
        </div>
    );
};

export default App;
