import { TouchableOpacity, Image, StyleSheet } from "react-native";

const BackBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.BackBtn}>
      <Image source={require("../../../assets/voltar.png")} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BackBtn: {
    zIndex:20,
  },
});

export default BackBtn;
