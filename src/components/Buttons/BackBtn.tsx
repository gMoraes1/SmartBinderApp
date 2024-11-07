import { TouchableOpacity, Image } from "react-native";

const BackBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={require("../../../assets/voltar.png")} />
    </TouchableOpacity>
  );
};

export default BackBtn;
