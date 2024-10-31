import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NavigationProp } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from '../navigation/types'; // Ajuste o caminho conforme necessário
import styled from "styled-components/native";

interface ClassData {
  name: string;
  period: string;
  educationLevel: string;
  school: string;
}

type RegisterRouteProp = RouteProp<RootStackParamList, 'Classes'>;

const Container = styled.View`
  background-color: ${(props) => props.theme.background};
  width: 100%;
  padding: 16px;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  padding-top: 12%;
  color: ${(props) => props.theme.color};
`;

const ItemButton = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-vertical: 8px;
    border-radius: 8px;
    border: solid ${(props) => props.theme.borderColor} 2px;
    background-color: ${(props) => props.theme.backgroundList};
    elevation: 5;
`;

export default function Classes() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RegisterRouteProp>();
  const [classes, setClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    // Verifique se route.params existe antes de acessá-lo
    if (route.params && route.params.classData) {
      setClasses((prevClasses) => [...prevClasses, route.params.classData]);
    }
  }, [route.params]);

  const handleDelete = (index: number) => {
    setClasses((prevClasses) => prevClasses.filter((_, i) => i !== index));
  };

  const renderItem = ({ item, index }: { item: ClassData; index: number }) => (
    <ItemButton
      onPress={() => navigation.navigate("RegisterClasses")}
      
    >
      <View>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.studentCount}>{0} alunos</Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(index)}
        style={styles.BtnDelete}
      >
        <Text style={styles.TxtDelete}>Deletar</Text>
      </TouchableOpacity>
    </ItemButton>
  );

  return (
    <Container>
      <Title style={styles.title}>Turmas</Title>

      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterClasses")}
        style={styles.BtnAdd}
      >
        <Text style={styles.TxtBtn1}>+</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
  },

  list: {
    marginBottom: 20,
  },

  classItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },

  className: {
    fontSize: 20,
    fontWeight: "600",
  },

  studentCount: {
    fontSize: 16,
    color: "#6939E9",
  },

  BtnDelete: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
  },

  TxtDelete: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  BtnAdd: {
    width: 60,
    height: 60,
    backgroundColor: "#6939E9",
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  TxtBtn1: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    lineHeight: 60,
  },
});
