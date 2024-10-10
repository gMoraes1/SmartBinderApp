import { TouchableOpacity, Image } from "react-native";

const Voltar = () => {
  return (
    <TouchableOpacity>
      <Image source={require("../assets/voltar.png")} />
    </TouchableOpacity>
  );
};

export default Voltar;
