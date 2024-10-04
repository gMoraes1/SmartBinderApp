// import { createContext, useState } from "react";


// interface authData {
//     // dados puxados de uma possivel API
//     token: string,
//     email: string,
//     user: string
// }

// interface authContextData {
//     authData?: authData;
//     signIn: (username: string, email: string, password: string) => Promise<authData>;
//     signOut: () => Promise<void>;
// }

// export const AuthContext = createContext<authContextData>(
//     {} as authContextData
// );

// export const AuthProvider: React.FC = ({children}) => {
//     const [authData, setAuthData] = useState<authData>();

//   async function signIn(): Promise<authData>{
// // chamar API


//     };

//     function signOut(){
// // fazer logout
//     };

// return  <AuthContext.Provider value={{authData, signIn, signOut}}>{children}</AuthContext.Provider>
// }
