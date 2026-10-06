# Syncfusion Gantt Chart - Virtual Scrolling with Large Dataset

This project showcases a high-performance Gantt chart implementation that efficiently handles 5K, 10K, and 25K task records through row and timeline virtualization. It includes realistic project hierarchies, multi-type dependencies, resource allocation, and comprehensive performance metrics to measure render efficiency.

## Features

### 1. **Project and Task Management**
Create, edit, delete, and organize tasks with hierarchical structure support
- **Code Snippet:**
  ```jsx
  <GanttComponent
    editSettings={{
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      mode: 'Dialog'
    }}
    taskFields={{
      id: 'TaskID',
      name: 'TaskName',
      parentID: 'ParentID'
    }}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Managing Tasks in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/managing-tasks/)

### 2. **Task Allocation**
Resource assignment support for single and multiple resource assignments
- **Code Snippet:**
  ```jsx
  <GanttComponent
    resources={resourceData}
    resourceFields={{
      id: 'ResourceID',
      name: 'ResourceName'
    }}
    taskFields={{
      resourceInfo: 'ResourceID'
    }}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Resources in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/resources/)

### 3. **Task Dependencies**
Predecessor-based dependency visualization with multiple dependency types (FS, SS, FF, SF)
- **Code Snippet:**
  ```jsx
  <GanttComponent
    taskFields={{
      dependency: 'Dependency'  // Format: "2FS", "3SS", "4FF", "5SF"
    }}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Task Dependency in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/task-dependency/)

### 4. **Timeline Tracking**
Start Date, End Date, Duration, and Progress display with real-time updates
- **Code Snippet:**
  ```jsx
  <GanttComponent
    taskFields={{
      startDate: 'StartDate',
      endDate: 'EndDate',
      duration: 'Duration',
      progress: 'Progress'
    }}
    columns={[
      { field: 'TaskName', headerText: 'Task Name' },
      { field: 'StartDate', headerText: 'Start Date' },
      { field: 'EndDate', headerText: 'End Date' },
      { field: 'Duration', headerText: 'Duration' },
      { field: 'Progress', headerText: 'Progress' }
    ]}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Timeline in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/timeline/)

### 5. **Dialog-based Editing**
Built-in dialog editing mode for add, edit, and delete operations
- **Code Snippet:**
  ```jsx
  <GanttComponent
    editSettings={{
      mode: 'Dialog',
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true
    }}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Editing Tasks in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/editing/)

### 6. **Large Datasets**
Row Virtualization for seamless handling of large task datasets (5K, 10K, 25K records)
- **Code Snippet:**
  ```jsx
  <GanttComponent
    enableVirtualization={true}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Virtual Scroll in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/virtual-scroll/)

### 7. **Large Timeline Ranges**
Timeline Virtualization for efficient rendering of extended date ranges
- **Code Snippet:**
  ```jsx
  <GanttComponent
    enableTimelineVirtualization={true}
  />
  ```
- **File:** `src/components/Gantt.jsx`
- **Documentation:** [Virtual Scroll in React Gantt Chart Component](https://www.syncfusion.com/documentation/react/gantt/virtual-scroll/)

## Project Structure

```
virtual-scrolling-large-dataset/
├── src/
│   ├── components/
│   │   └── Gantt.jsx              # Main Gantt component with virtual scrolling
│   ├── App.jsx                    # Root application component
│   ├── App.css                    # Application styles
│   ├── basePath.ts                # Dynamic base path detection for Azure
│   ├── index.css                  # Global styles
│   ├── main.jsx                   # React entry point
│   └── vite-env.d.ts              # Vite environment types
├── public/
│   └── web.config                 # Azure App Service IIS configuration
├── dist/                          # Production build output (generated)
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
├── README.md                       # This file
└── .gitignore                      # Git ignore rules
```

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.8 | UI framework |
| Vite | 8.3.0 | Build tool & dev server |
| Syncfusion Gantt | 35.1.37 | Gantt chart component |
| Node.js | 18+ | Runtime environment |

## How to Run

### Prerequisites
- **Node.js:** 18 or higher
- **npm:** 9+ or **yarn** 3+

### Development Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd virtual-scrolling-large-dataset
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`

4. **Open in browser:**
   - Navigate to the local URL shown in the terminal
   - Select dataset size (5K, 10K, or 25K tasks) from the interface
   - Observe performance metrics for Expand All / Collapse All operations

### Building for Production

1. **Build optimized bundle:**
   ```bash
   npm run build
   ```

2. **Preview production build locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to Azure:**
   - The `dist/` folder is ready for deployment to Azure App Service
   - Ensure `web.config` is included in the deployment

### Available npm Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Create optimized production build
- `npm run preview` — Preview production build locally
- `npm run lint` — Run linter (oxlint)
| React Router | 8.3.0 | Client-side routing |
| Tailwind CSS Theme | Latest | Syncfusion styling |

## Available Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run Oxlint checks
```

## Data Generation

### Task Structure
- **Hierarchical**: 1 parent task with 49 child tasks per group
- **Total Groups**: Calculated from record count (5K = 100 groups, 10K = 200, 25K = 500)
- **Durations**: Child tasks vary 1-5 days (cycling pattern)

### Resource Assignment
- **Parents**: Single resource per parent (cycles through 8 resources)
- **Children**: 
  - Most tasks: Single resource
  - Every 7th task: Multiple resources (team allocation)

### Dependencies
- **Pattern A** (groupIndex % 3 === 0): Tasks 2→25, 3→26, 4→27, 5→28, 10→40...19→49
- **Pattern B** (groupIndex % 3 === 1): Tasks 3→26, 4→27, 5→28, 6→29, 11→42...20→51
- **Pattern C** (groupIndex % 3 === 2): Tasks 4→27, 5→28, 6→29, 7→30, 12→44...21→53

Each dependency cycles through 4 types: FS, SS, FF, SF

## Performance Metrics

The app measures:
1. **Initial Render Time**: From data generation start to first dataBound event
2. **Expand All Time**: Operation duration for expanding all task groups
3. **Collapse All Time**: Operation duration for collapsing all task groups
4. **Total Records**: Count of loaded tasks

Timing uses `performance.now()` for microsecond precision and is formatted to 3 decimal places.

## License

Syncfusion Community License - See license.txt or Syncfusion website for details.

## Support

For issues, questions, or feature requests, please refer to:
- Syncfusion Documentation: https://ej2.syncfusion.com/react/documentation/gantt/
- Project Repository: [https://github.com/SyncfusionExamples/virtual-scrolling-large-dataset]
