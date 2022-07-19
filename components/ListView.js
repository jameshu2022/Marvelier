import { React, createContext, useContext, useState } from "react";

const listViewContext = createContext();

function useProvideListView() {
  const [listView, setListView] = useState(false);

  return {
    listView,
    toggleListView() {
      setListView(!listView);
    },
  };
}

export function ListViewProvider({ children }) {
  const listView = useProvideListView();

  return (
    <listViewContext.Provider value={listView}>
      {children}
    </listViewContext.Provider>
  );
}

export function useListView() {
  return useContext(listViewContext);
}
