import { TouchableOpacity, Image } from "react-native";

const Voltar = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={require("../../../assets/voltar.png")} />
    </TouchableOpacity>
  );
};

export default Voltar;
