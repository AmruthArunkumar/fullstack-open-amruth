const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => (
    <div>
        {props.parts.map((p) => (
            <Part part={p} key={p.id} />
        ))}
    </div>
);

const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
);

const Total = (props) => (
    <p>
        <b>Number of exercises {props.total}</b>
    </p>
);

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total total={course.parts.reduce((acc, val) => acc + val.exercises, 0)} />
        </div>
    );
};

export default Course;
