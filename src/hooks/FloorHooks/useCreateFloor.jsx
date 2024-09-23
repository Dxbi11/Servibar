import { useState, useContext } from "react";
import { store } from "../../../store";
import { createFloor } from "../../api";
import { useToast } from "@chakra-ui/react";

const useCreateFloor = () => {
  const { state, dispatch } = useContext(store);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const addFloor = async (floorData) => {
    setError("");
    setIsLoading(true);

    try {
      const { floorNumber, hotelId } = floorData;

      // Check if floor already exists
      const floorExists = state.ui.floors.some(
        (floor) =>
          floor.hotelId === parseInt(hotelId) &&
          floor.floorNumber === parseInt(floorNumber)
      );

      if (floorExists) {
        setError(`Floor ${floorNumber} already exists in the selected hotel.`);
        setIsLoading(false);
        return null;
      }

      const newFloor = await createFloor({
        floorNumber: parseInt(floorNumber),
        hotelId: parseInt(hotelId),
      });

      dispatch({ type: "ADD_FLOOR", payload: newFloor });

      toast({
        title: "Floor added.",
        description: `Floor ${floorNumber} has been added to the hotel.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsLoading(false);
      return newFloor;
    } catch (error) {
      console.error("Error creating floor:", error);
      setError("Failed to create floor. Please try again.");
      setIsLoading(false);
      return null;
    }
  };

  return { addFloor, error, isLoading };
};

export default useCreateFloor;
