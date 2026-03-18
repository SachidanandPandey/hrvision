import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree'; // Ensure proper import
import 'react-complex-tree/lib/style-modern.css'; // Critical for visibility

// Flat tree structure (must have 'index', 'data', 'children' where needed)
const treeItems = [
  {
    index: 'root',
    hasChildren: true,
    children: ['masters', 'leave', 'payroll', 'vendorportal'],
    data: 'HRVision',
    canMove: false,
    isFolder: true,
  },
  {
    index: 'masters',
    hasChildren: true,
    children: ['state', 'employee', 'company','country','city','department'],
    data: 'Masters',
    canMove: false,
    isFolder: true,
  },
  {
    index: 'state',
    data: <Link to="/masters/state">State Master</Link>,
    canMove: false,
  },
  {
    index: 'employee',
    data: <Link to="/masters/employee">Employee Master</Link>,
    canMove: false,
  },
  {
    index: 'country',
    data: <Link to="/masters/country">Country Master</Link>,
    canMove: false,
  },
   {
    index: 'city',
    data: <Link to="/masters/city">Country Master</Link>,
    canMove: false,
  },
  {
    index: 'department',
    data: <Link to="/masters/department">Department Master</Link>,
    canMove: false,
  }, 
    {
    index: 'designation',
    data: <Link to="/masters/designation">Designation Master</Link>,
    canMove: false,
  },
  {
    index: 'division',
    data: <Link to="/masters/division">Division Master</Link>,
    canMove: false,
  },
   {
    index: 'employeeGrade',
    data: <Link to="/masters/employeeGrade">EmployeeGrade Master</Link>,
    canMove: false,
  },
  {
    index: 'company',
    data: <Link to="/masters/company">Company Master</Link>,
    canMove: false,
  },
  {
    index: 'leave',
    hasChildren: true,
    children: ['leave-application'],
    data: 'Leave Management',
    canMove: false,
    isFolder: true,
  },
  {
    index: 'leave-application',
    data: <Link to="/leave/application">Leave Application</Link>,
    canMove: false,
  },
  {
    index: 'payroll',
    hasChildren: true,
    children: ['salary-slip'],
    data: 'Payroll',
    canMove: false,
    isFolder: true,
  },
  {
    index: 'salary-slip',
    data: <Link to="/payroll/salary">Salary Slip</Link>,
    canMove: false,
  },
  {
    index: 'vendorportal',
    hasChildren: true,
    children: ['vendor-dashboard'],
    data: 'Vendor Portal',
    canMove: false,
    isFolder: true,
  },
  {
    index: 'vendor-dashboard',
    data: <Link to="/vendorportal/dashboard">Vendor Dashboard</Link>,
    canMove: false,
  },
];

const TreeMenu = () => {
  const [viewState, setViewState] = useState({ expanded: ['root'] });
  const [treeDataProvider, setTreeDataProvider] = useState(null);

  // Initialize the tree data provider
  useEffect(() => {
    const provider = new StaticTreeDataProvider(treeItems); // Initialize correctly
    setTreeDataProvider(provider);
  }, []);

  // Ensure that treeDataProvider is ready before rendering the tree
  if (!treeDataProvider) {
    return <div>Loading...</div>; // Show loading until provider is ready
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '8px', background: '#f8f9fa' }}>
      <UncontrolledTreeEnvironment
        items={treeItems}
        getItemTitle={(item) => (typeof item.data === 'string' ? item.data : item.data.props.children || 'Item')}
        viewState={viewState}  // Control expanded state
        renderItemTitle={({ title }) => title}
        // Correct callbacks to handle expand/collapse
        onExpandItem={(item) => {
          setViewState((prevState) => ({
            expanded: [...prevState.expanded, item.index],
          }));
        }}
        onCollapseItem={(item) => {
          setViewState((prevState) => ({
            expanded: prevState.expanded.filter((index) => index !== item.index),
          }));
        }}
      >
        <Tree
          treeId="hrvision-tree"
          rootItem="root"
          treeLabel="HRVision Navigation Menu"
          getItemTitle={(item) => (typeof item.data === 'string' ? item.data : item.data.props.children || 'Item')}
        />
      </UncontrolledTreeEnvironment>
    </div>
  );
};

export default TreeMenu;