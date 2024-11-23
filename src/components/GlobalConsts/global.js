// global.js
class Globais {
    static currentTheme = 'device'; // Padrão para o tema do dispositivo
  
    static setCurrentTheme(theme) {
      Globais.currentTheme = theme; // Atualiza o tema global
    }
  
    static getCurrentTheme() {
      return Globais.currentTheme; // Retorna o tema atual
    }
  }
  
  export default Globais;
  