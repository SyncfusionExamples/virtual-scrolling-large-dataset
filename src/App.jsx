import './App.css';
import GanttChart from './components/Gantt';

function App() {
  return (
    <div className="app-shell">
      <main className="home-page" aria-label="Syncfusion workspace home">
      <header className="workspace-header">
        <div className="sf-brand">
          <h1>Syncfusion Gantt Chart - Demo</h1>
        </div>
      </header>
      <section className="workspace-content">
        <GanttChart />
      </section>
    </main>
    </div>
  );
}

export default App;
