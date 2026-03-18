import React, { useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const MenuItem = ({ menu, subMenus, activeMenu, activeSubMenu, setActiveMenu }) => {
  const [open, setOpen] = useState(activeMenu === menu);

  const handleClick = () => {
    setOpen(!open);
    setActiveMenu(menu, subMenus[0] || "");
  };

  return (
    <>
      <ListItem
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          bgcolor: activeMenu === menu ? "#e3f2fd" : "transparent",
        }}
      >
        <ListItemText primary={menu} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subMenus.map((subMenu) => (
            <ListItem
              key={subMenu}
              component={Link}
              to={`/${menu.toLowerCase()}/${subMenu.toLowerCase().replace(/\s+/g, "-")}`}
              sx={{
                pl: 4,
                cursor: "pointer",
                bgcolor: activeSubMenu === subMenu ? "#bbdefb" : "transparent",
              }}
              onClick={() => setActiveMenu(menu, subMenu)}
            >
              <ListItemText primary={subMenu} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default MenuItem;