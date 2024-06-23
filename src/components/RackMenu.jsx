import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import AddHotelForm from './AddHotel';
import AddFloors from './AddFloor';
import DeleteModal from './Delete';

const RackMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem><AddHotelForm/></MenuItem>
        <MenuItem><AddFloors/></MenuItem>
        <MenuItem><DeleteModal/></MenuItem>
      </MenuList>
    </Menu>
  );
};

export default RackMenu;
