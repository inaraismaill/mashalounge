import { createContext, useState } from "react";

export const CollapseContext = createContext();

export const CollapseProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <CollapseContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </CollapseContext.Provider>
  );
};
