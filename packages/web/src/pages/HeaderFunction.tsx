import { useOutletContext } from "react-router-dom";
import { HeaderLayoutContext } from "./HeaderLayout";

export const useHeaderContext = () => useOutletContext<HeaderLayoutContext>();
