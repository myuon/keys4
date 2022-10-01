import "./App.css";
import { useDb } from "./db";

const useRepository = () => {
  const { db } = useDb();

  const stmt = db?.prepare("select * from repositories;");
  const result = [];
  while (stmt?.step()) {
    result.push(stmt.getAsObject());
  }

  return result;
};

const useDeployment = () => {
  const { db } = useDb();

  const stmt = db?.prepare("select * from deployments;");
  const result = [];
  while (stmt?.step()) {
    result.push(stmt.getAsObject());
  }

  return result;
};

function App() {
  const repositories = useRepository();
  const deployments = useDeployment();

  return (
    <div className="App">
      <h1>Four Keys</h1>
      <div>
        {repositories?.map((r, i) => (
          <h2 key={i}>
            {r.owner}/{r.name}
          </h2>
        ))}
      </div>
      <div>
        {deployments?.map((d, i) => (
          <div key={i}>{d.url}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
