import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { BsImages, BsList } from "react-icons/bs";

import { useListView } from "./ListView";

function ToggleListView() {
  const listView = useListView();
  return (
    <Tooltip
      label={listView.listView ? "Switch to Image View" : "Switch to List View"}
    >
      <IconButton
        onClick={() => listView.toggleListView()}
        icon={!listView.listView ? <ListIcon /> : <ImagesIcon />}
      />
    </Tooltip>
  );
}

function ImagesIcon() {
  return <Icon as={BsImages} />;
}

function ListIcon() {
  return <Icon as={BsList} />;
}

export default ToggleListView;
