# Syncfusion Gantt Chart - POC Demo

A production-ready Syncfusion Gantt Chart demonstration built with React 19.2.8, Vite 8.3.0, and optimized for Azure App Service deployment.

## Features

✅ **High-Performance Gantt Chart**
- Hierarchical task structure (1 parent + 49 children per group)
- Row and timeline virtualization for handling large datasets
- Support for 5K, 10K, and 25K records

✅ **Long-Range Dependencies**
- 4 dependency types: FS (Finish-to-Start), SS (Start-to-Start), FF (Finish-to-Finish), SF (Start-to-Finish)
- 14 strategic dependencies per parent group
- Realistic project relationship visualization

✅ **Resource Allocation**
- 8 sample resources with unit capacity
- Single and multiple resource assignment per task
- Resource management through Task Information dialog
- Resource editing support with drag-and-drop

✅ **Performance Metrics**
- High-resolution timing using `performance.now()` (microseconds precision)
- Real-time render time measurement
- Expand All / Collapse All operation tracking
- Metrics display in seconds (3 decimal precision)

✅ **Editing & Operations**
- Add, Edit, Delete task operations
- Taskbar editing with drag-drop
- Dialog-based task information editor
- Toolbar with Expand All/Collapse All buttons

✅ **Azure Deployment Ready**
- Single-page application (SPA) without routing
- Dynamic base path detection via `basePath.ts`
- Web.config for Azure App Service URL rewriting
- Gzip compression enabled

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder is ready for deployment to Azure App Service.

## Project Structure

```
my-gantt-app/
├── src/
│   ├── components/
│   │   ├── Gantt.jsx         # Main Gantt component with data generation
│   │   └── Home.jsx          # Home page layout
│   ├── App.jsx               # App container
│   ├── basePath.ts           # Dynamic base path detection
│   ├── main.jsx              # React entry point with BrowserRouter
│   ├── index.css             # Global styles
│   ├── App.css               # App styles
│   └── Home.css              # Home page styles
├── public/
│   └── web.config            # Azure App Service configuration
├── dist/                     # Production build (generated)
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── AZURE_DEPLOYMENT.md       # Azure deployment guide
```

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.8 | UI framework |
| Vite | 8.3.0 | Build tool & dev server |
| Syncfusion Gantt | 35.1.37 | Gantt chart component |
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
