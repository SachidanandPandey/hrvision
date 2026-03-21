import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UncontrolledTreeEnvironment,
  Tree
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";

// ---------------- TREE DATA ----------------
const treeItems = [
  {
    index: "root",
    hasChildren: true,
    children: ["masters", "leave", "payroll", "vendorportal"],
    data: "HRVision",
    isFolder: true
  },
  {
    index: "masters",
    hasChildren: true,
    children: [
      "state",
      "employee",
      "company",
      "country",
      "city",
      "department",
      "designation",
      "division",
      "employeeGrade"
    ],
    data: "Masters",
    isFolder: true
  },

  // ---------- MASTERS ----------
  {
    index: "state",
    data: <Link to="/masters/state">State Master</Link>
  },
  {
    index: "employee",
    data: <Link to="/masters/employee">Employee Master</Link>
  },
  {
    index: "country",
    data: <Link to="/masters/country">Country Master</Link>
  },
  {
    index: "city",
    data: <Link to="/masters/city">City Master</Link> // ✅ FIXED
  },
  {
    index: "department",
    data: <Link to="/masters/department">Department Master</Link>
  },
  {
    index: "designation",
    data: <Link to="/masters/designation">Designation Master</Link>
  },
  {
    index: "division",
    data: <Link to="/masters/division">Division Master</Link>
  },
  {
    index: "employeeGrade",
    data: <Link to="/masters/employeeGrade">Employee Grade</Link>
  },
  {
    index: "company",
    data: <Link to="/masters/company">Company Master</Link>
  },

  // ---------- LEAVE ----------
  {
    index: "leave",
    hasChildren: true,
    children: ["leave-application"],
    data: "Leave Management",
    isFolder: true
  },
  {
    index: "leave-application",
    data: <Link to="/leave/application">Leave Application</Link>
  },

  // ---------- PAYROLL ----------
  {
    index: "payroll",
    hasChildren: true,
    children: ["salary-slip"],
    data: "Payroll",
    isFolder: true
  },
  {
    index: "salary-slip",
    data: <Link to="/payroll/salary">Salary Slip</Link>
  },

  // ---------- VENDOR ----------
  {
    index: "vendorportal",
    hasChildren: true,
    children: ["vendor-dashboard"],
    data: "Vendor Portal",
    isFolder: true
  },
  {
    index: "vendor-dashboard",
    data: <Link to="/vendorportal/dashboard">Vendor Dashboard</Link>
  }
];

// ---------------- COMPONENT ----------------
const TreeMenu = () => {
  const [viewState, setViewState] = useState({
    expanded: ["root"]
  });

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: 8,
        background: "#f8f9fa"
      }}
    >
      <UncontrolledTreeEnvironment
        items={treeItems}
        getItemTitle={(item) =>
          typeof item.data === "string"
            ? item.data
            : item.data?.props?.children || "Item"
        }
        viewState={viewState}
        renderItemTitle={({ title }) => title}
        onExpandItem={(item) => {
          setViewState((prev) => ({
            expanded: [...prev.expanded, item.index]
          }));
        }}
        onCollapseItem={(item) => {
          setViewState((prev) => ({
            expanded: prev.expanded.filter((i) => i !== item.index)
          }));
        }}
      >
        <Tree
          treeId="hrvision-tree"
          rootItem="root"
          treeLabel="HRVision Navigation Menu"
        />
      </UncontrolledTreeEnvironment>
    </div>
  );
};

export default TreeMenu;