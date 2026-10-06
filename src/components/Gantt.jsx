import { useState, useRef } from 'react';
import { GanttComponent, Inject, Selection, ColumnsDirective, ColumnDirective, Edit, Toolbar, VirtualScroll } from '@syncfusion/ej2-react-gantt';

// Sample resource collection for task allocation
const resourceCollection = [
  { resourceId: 1, resourceName: 'Alice Johnson', resourceUnit: 100 },
  { resourceId: 2, resourceName: 'Bob Smith', resourceUnit: 100 },
  { resourceId: 3, resourceName: 'Carol White', resourceUnit: 100 },
  { resourceId: 4, resourceName: 'David Brown', resourceUnit: 100 },
  { resourceId: 5, resourceName: 'Eve Davis', resourceUnit: 100 },
  { resourceId: 6, resourceName: 'Frank Miller', resourceUnit: 100 },
  { resourceId: 7, resourceName: 'Grace Lee', resourceUnit: 100 },
  { resourceId: 8, resourceName: 'Henry Taylor', resourceUnit: 100 },
];

// Function to generate large datasets with hierarchy and long-range dependencies
const generateTaskData = (recordCount) => {
  const tasks = [];
  const startDate = new Date(2025, 3, 2);

  // Create 1 parent task with 49 child tasks (repeating pattern for large datasets)
  const createTaskGroup = (groupIndex) => {
    const baseTaskId = groupIndex * 50;
    const parentId = baseTaskId + 1;
    const parentStartDate = new Date(startDate);
    parentStartDate.setDate(parentStartDate.getDate() + (groupIndex * 60));

    // Parent task
    tasks.push({
      TaskID: parentId,
      TaskName: `Project ${groupIndex + 1}`,
      StartDate: new Date(parentStartDate),
      Duration: 50,
      Progress: Math.floor(Math.random() * 100),
      // Assign a primary resource to each parent (cycling through resources)
      resourceId: [(groupIndex % 8) + 1],
    });

    // 49 child tasks with unique dependencies per parent and varied durations
    for (let i = 1; i <= 49; i++) {
      const childTaskId = baseTaskId + 1 + i;
      const childStartDate = new Date(parentStartDate);
      childStartDate.setDate(childStartDate.getDate() + i);

      // Vary duration: 1-5 days based on task position (cycling pattern)
      const duration = (i % 5) + 1;

      let predecessor = null;
      
      // Create unique dependency patterns for each parent group
      const depTypes = ['FS', 'SS', 'FF', 'SF'];
      const depTypeIndex = groupIndex % 4; // Rotate through dependency types per group
      
      // Different dependency patterns based on parent group index
      if (groupIndex % 3 === 0) {
        // Pattern A: Task 2→25, 3→26, 4→27, 5→28, 10→40, 11→41, 12→42, 13→43, 14→44, 15→45, 16→46, 17→47, 18→48, 19→49
        if (i === 2 || i === 3 || i === 4 || i === 5 || (i >= 10 && i <= 19)) {
          const targetTask = i <= 5 ? baseTaskId + 23 + i : baseTaskId + 30 + i;
          const depType = depTypes[(i - 2) % 4];
          predecessor = `${targetTask}${depType}`;
        }
      } else if (groupIndex % 3 === 1) {
        // Pattern B: Task 3→26, 4→27, 5→28, 6→29, 11→42, 12→43, 13→44, 14→45, 15→46, 16→47, 17→48, 18→49, 19→50, 20→51
        if ((i >= 3 && i <= 6) || (i >= 11 && i <= 20)) {
          const targetTask = i <= 6 ? baseTaskId + 23 + i : baseTaskId + 31 + i;
          const depType = depTypes[(i - 3) % 4];
          predecessor = `${targetTask}${depType}`;
        }
      } else {
        // Pattern C: Task 4→27, 5→28, 6→29, 7→30, 12→44, 13→45, 14→46, 15→47, 16→48, 17→49, 18→50, 19→51, 20→52, 21→53
        if ((i >= 4 && i <= 7) || (i >= 12 && i <= 21)) {
          const targetTask = i <= 7 ? baseTaskId + 23 + i : baseTaskId + 32 + i;
          const depType = depTypes[(i - 4) % 4];
          predecessor = `${targetTask}${depType}`;
        }
      }

      // Assign resources to child tasks (varying patterns per group)
      // Pattern 1: Single resource assignment (most common)
      // Pattern 2: Multiple resource assignment (for some tasks)
      let assignedResource;
      if (i % 7 === 0) {
        // Every 7th task gets multiple resources
        const res1 = ((groupIndex + i) % 8) + 1;
        const res2 = ((groupIndex + i + 2) % 8) + 1;
        assignedResource = [res1, res2];
      } else {
        // Other tasks get single resource
        assignedResource = [((groupIndex + i) % 8) + 1];
      }

      tasks.push({
        TaskID: childTaskId,
        TaskName: `Task ${i} - Group ${groupIndex + 1}`,
        StartDate: new Date(childStartDate),
        Duration: duration,
        Progress: Math.floor(Math.random() * 100),
        ParentId: parentId,
        resourceId: assignedResource,
        ...(predecessor && { Predecessor: predecessor }),
      });
    }
  };

  // Calculate number of groups needed
  const groupsNeeded = Math.ceil(recordCount / 50);

  for (let g = 0; g < groupsNeeded; g++) {
    createTaskGroup(g);
    if (tasks.length >= recordCount) {
      break;
    }
  }

  return tasks.slice(0, recordCount);
};

export default function Gantt() {
  const ganttRef = useRef(null);
  const [recordCount, setRecordCount] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [metrics, setMetrics] = useState({
    initialRenderTime: null,
    expandAllTime: null,
    collapseAllTime: null,
    recordUpdateTime: null,
  });
  // Use performance.now() for high-resolution timing (microseconds precision)
  const renderStartRef = useRef(null);
  const measureEnabledRef = useRef(false);

  const taskFields = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    parentID: 'ParentId',
    resourceInfo: 'resourceId',
  };

  const resourceFields = {
    id: 'resourceId',
    name: 'resourceName',
    unit: 'resourceUnit',
  };

  const labelSettings = {
    leftLabel: 'TaskName',
  };

  const splitterSettings = {
    columnIndex: 2,
  };

  const projectStartDate = new Date(2025, 3, 2);
  const projectEndDate = new Date(2058, 11, 31);

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    mode: 'Dialog',
  };

  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];

  const loadDataset = (count) => {
    // Start high-resolution timer BEFORE data generation
    // This captures: data generation + React commit + browser paint
    renderStartRef.current = performance.now();
    measureEnabledRef.current = true;
    
    // Reset metrics immediately
    setMetrics({
      initialRenderTime: null,
      expandAllTime: null,
      collapseAllTime: null,
      recordUpdateTime: null,
    });
    
    // Generate new data synchronously
    const newData = generateTaskData(count);
    
    // Update state - this triggers re-render and dataBound event
    setRecordCount(count);
    setTaskData(newData);
  };

  const handleLoad5K = () => loadDataset(5000);
  const handleLoad10K = () => loadDataset(10000);
  const handleLoad25K = () => loadDataset(25000);

  const handleDataBound = () => {
    // Measure render time only on first dataBound after data change (using flag pattern)
    if (!measureEnabledRef.current || renderStartRef.current === null) return;
    
    // Calculate delta in seconds with high precision
    const deltaSeconds = (performance.now() - renderStartRef.current) / 1000;
    
    // Disable measurement to prevent re-measuring on subsequent events
    measureEnabledRef.current = false;
    renderStartRef.current = null;
    
    // Round to 3 decimal places for consistency (same as benchmark project)
    const roundedTime = Math.round(deltaSeconds * 1000) / 1000;
    
    setMetrics(prev => ({
      ...prev,
      initialRenderTime: roundedTime * 1000, // Convert back to ms for display conversion
    }));
  };

  const onExpandAll = () => {
    const expandStartTime = Date.now();
    ganttRef.current.expandAll();
    const expandEndTime = Date.now();
    
    setMetrics(prev => ({
      ...prev,
      expandAllTime: expandEndTime - expandStartTime,
    }));
  };

  const onCollapseAll = () => {
    const collapseStartTime = Date.now();
    ganttRef.current.collapseAll();
    const collapseEndTime = Date.now();
    
    setMetrics(prev => ({
      ...prev,
      collapseAllTime: collapseEndTime - collapseStartTime,
    }));
  };

  const onToolbarClick = (args) => {
    if (args.item.id === 'DefaultGantt_expandall') {
      onExpandAll();
    } else if (args.item.id === 'DefaultGantt_collapseall') {
      onCollapseAll();
    }
  };

  const recordOptions = [
    { text: '10K Records', value: 10000 },
    { text: '25K Records', value: 25000 },
    { text: '50K Records', value: 50000 }
  ];

  // Helper function to convert milliseconds to seconds with 3 decimal places
  // Matches benchmark project format: 1.234 s, 0.045 s, etc.
  const msToSeconds = (ms) => {
    if (ms === null || ms === undefined) return null;
    const seconds = ms / 1000;
    return seconds.toFixed(3);
  };

  return (
    <div style={{ padding: '0 0 10px 0', margin: '0 auto' }}>
      {/* Controls Section - Load Data Buttons */}
      <div style={{
        marginBottom: '15px',
        padding: '10px 12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Load Dataset:
        </label>
        <button
          onClick={handleLoad5K}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#117a8b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#17a2b8'}
        >
          Load 5K
        </button>
        <button
          onClick={handleLoad10K}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Load 10K
        </button>
        <button
          onClick={handleLoad25K}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e7e34'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Load 25K
        </button>
      </div>

      {/* Performance Metrics Section */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#e8f4f8',
        borderRadius: '5px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px'
      }}>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
          <strong>Initial Render Time:</strong>
          <div style={{ color: '#007bff', fontSize: '18px', marginTop: '5px' }}>
            {metrics.initialRenderTime !== null ? `${msToSeconds(metrics.initialRenderTime)} s` : (taskData.length === 0 ? 'Click button to load' : 'Loading...')}
          </div>
        </div>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
          <strong>Expand All Time:</strong>
          <div style={{ color: '#28a745', fontSize: '18px', marginTop: '5px' }}>
            {metrics.expandAllTime !== null ? `${msToSeconds(metrics.expandAllTime)} s` : 'Not measured'}
          </div>
        </div>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
          <strong>Collapse All Time:</strong>
          <div style={{ color: '#dc3545', fontSize: '18px', marginTop: '5px' }}>
            {metrics.collapseAllTime !== null ? `${msToSeconds(metrics.collapseAllTime)} s` : 'Not measured'}
          </div>
        </div>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
          <strong>Total Records:</strong>
          <div style={{ color: '#6c757d', fontSize: '18px', marginTop: '5px' }}>
            {taskData.length.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div style={{ marginTop: '20px' }}>
        {taskData.length === 0 ? (
          <div
            style={{
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              padding: '60px 20px',
              textAlign: 'center',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#495057', marginBottom: '10px' }}>
                No Data Loaded
              </div>
              <div style={{ fontSize: '16px', color: '#6c757d' }}>
                Click one of the load buttons above to render the Gantt chart with performance metrics.
              </div>
            </div>
          </div>
        ) : (
          <GanttComponent
            id='DefaultGantt'
            ref={ganttRef}
            dataSource={taskData}
            treeColumnIndex={1}
            taskFields={taskFields}
            resourceFields={resourceFields}
            resources={resourceCollection}
            splitterSettings={splitterSettings}
            labelSettings={labelSettings}
            height='700px'
            taskbarHeight={25}
            rowHeight={36}
            editSettings={editSettings}
            toolbar={toolbar}
            dataBound={handleDataBound}
            toolbarClick={onToolbarClick}
            enableVirtualization={true}
            enableTimelineVirtualization={true}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
          >
            <ColumnsDirective>
              <ColumnDirective field='TaskID' headerText='ID' width='60' />
              <ColumnDirective field='TaskName' headerText='Task Name' width='250' clipMode='EllipsisWithTooltip' />
              <ColumnDirective field='resourceId' headerText='Resource' width='150' />
              <ColumnDirective field='StartDate' headerText='Start Date' width='100' />
              <ColumnDirective field='Duration' headerText='Duration' width='80' />
              <ColumnDirective field='Progress' headerText='Progress' width='80' />
              <ColumnDirective field='Predecessor' headerText='Dependency' width='100' />
            </ColumnsDirective>
            <Inject services={[Selection, Edit, Toolbar, VirtualScroll]} />
          </GanttComponent>
        )}
      </div>
    </div>
  );
}