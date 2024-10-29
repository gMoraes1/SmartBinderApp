// navigation/types.ts
export type ClassData = {
  name: string;
  period: string;
  educationLevel: string;
  school: string;
};

export type RootStackParamList = {
  Classes: { classData?: ClassData }; // Adicione a propriedade classData
  RegisterClasses: undefined;
  ClassDetails: undefined;
};
