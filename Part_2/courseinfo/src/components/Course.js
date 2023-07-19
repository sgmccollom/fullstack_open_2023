const Header = ({ course }) => {
  return (
    <>
      <h1>{course.name}</h1>
    </>
  );
}

const Total = (props) => {
  let partsArr = props.course.parts;
  let total = partsArr.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <p><b>total of {total} exercises</b></p>
    </div>
  );
}

const Part = (props) => {
  return (
    <>
    <p>
      {props.part} {props.exercises}
    </p>
    </>
  );  
}


const Content = (props) => {
  let partsArr = props.parts.parts;
  return (
    <>
      {partsArr.map(part => 
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      )}  
    </>
  );
}

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={course} />
      <Total course={course} />
    </>
  );
}

export default Course