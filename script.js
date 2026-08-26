/* ============================================================
   CONFIGURAÇÃO DO FIREBASE
   ============================================================
   1. Crie um projeto grátis em https://console.firebase.google.com
   2. No projeto, ative o "Firestore Database" (modo produção).
   3. Em "Configurações do projeto" > "Seus apps" > ícone </> (Web),
      registre um app e copie o objeto de configuração que aparece
      (algo parecido com o objeto abaixo) — cole no lugar deste.
   4. Em Firestore Database > Regras, cole as regras sugeridas no
      arquivo REGRAS_FIRESTORE.txt (enviado junto com este site) e
      publique.
   Sem isso preenchido, o site funciona normalmente (busca, placas
   etc.) mas o like/deslike fica desativado.
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCIhqKbJcGiVdI1VrGapRxDH3OcF-0E1CM",
  authDomain: "adaptacao-de-peliculas.firebaseapp.com",
  projectId: "adaptacao-de-peliculas",
  storageBucket: "adaptacao-de-peliculas.firebasestorage.app",
  messagingSenderId: "1015716132252",
  appId: "1:1015716132252:web:910a222124c2628f73c459"
};

let db;
try {
  if (firebaseConfig.apiKey !== "COLE_AQUI_SUA_API_KEY" && typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } else {
    console.warn('Firebase ainda não configurado — sistema de avaliação (like/deslike) desativado. Veja as instruções no topo do script.js.');
  }
} catch (e) {
  console.error('Erro ao iniciar o Firebase:', e);
}

const dados = [
/* ================= SAMSUNG ================= */
{marca:"Samsung",modelo:"Galaxy J2 Prime",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J2 Core",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J4 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J4 Core",adaptacoes:["Galaxy J4 Plus","Galaxy J6 Plus"]},
{marca:"Samsung",modelo:"Galaxy J4 Plus",adaptacoes:["Galaxy J4 Core","Galaxy J6 Plus"]},
{marca:"Samsung",modelo:"Galaxy J5",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J5 Prime",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J5 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J6 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J6 Plus",adaptacoes:["Galaxy J4 Core","Galaxy J4 Plus"]},
{marca:"Samsung",modelo:"Galaxy J7",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J7 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J7 Prime",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy J8",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A2 Core",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A6 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A6 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A7 2017",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A7 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A8 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A8 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A9 2018",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A01",adaptacoes:["Xiaomi Mi Play"]},
{marca:"Samsung",modelo:"Galaxy A01 Core",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A02S",adaptacoes:["Galaxy A02","Galaxy A03","Galaxy A12","Galaxy A13","Galaxy M12"]},
{marca:"Samsung",modelo:"Galaxy A03",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03S","Galaxy A03 Core","Galaxy A04","Galaxy A04S","Galaxy A04E","Galaxy A12","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy A03S",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03 Core","Galaxy A04","Galaxy A04S","Galaxy A04E","Galaxy A12","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy A03 Core",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A04","Galaxy A04S","Galaxy A04E","Galaxy A12","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy A04",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A03 Core","Galaxy A04S","Galaxy A04E","Galaxy A12","Galaxy A13","Galaxy M13"]},
{marca:"Samsung",modelo:"Galaxy A04S",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A03 Core","Galaxy A04","Galaxy A04E","Galaxy A12","Galaxy A13","Galaxy M13"]},
{marca:"Samsung",modelo:"Galaxy A04E",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A03 Core","Galaxy A04","Galaxy A04S","Galaxy A12","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy A07",adaptacoes:["Galaxy A05","Galaxy A06","Redmi 13C","Redmi C65"]},
{marca:"Samsung",modelo:"Galaxy A10S",adaptacoes:["Galaxy A10","Galaxy M10","Moto G8 Play","Moto G8 Plus","Moto G7","LG K40S","Redmi 8","Redmi 8A"]},
{marca:"Samsung",modelo:"Galaxy A16 4G",adaptacoes:["Galaxy A14","Galaxy A17","Galaxy M14"]},
{marca:"Samsung",modelo:"Galaxy A21S",adaptacoes:["Galaxy A21","Galaxy A71","Moto G22","Redmi Note 11","Poco X3"]},
{marca:"Samsung",modelo:"Galaxy A22",adaptacoes:["Galaxy A32 4G","Galaxy M31","Galaxy M32","Galaxy A33","Galaxy M22"]},
{marca:"Samsung",modelo:"Galaxy A23 5G",adaptacoes:["Galaxy A12","Galaxy M12","Galaxy A02","Galaxy A03","Galaxy A03S","Galaxy A04","Galaxy A04E","Galaxy A04S","Galaxy A70","Galaxy A32","Galaxy A22"]},
{marca:"Samsung",modelo:"Galaxy A30",adaptacoes:["Galaxy A20","Galaxy A50","Galaxy A30S","Galaxy A50S","Galaxy M31","Galaxy M30S"]},
{marca:"Samsung",modelo:"Galaxy A30S",adaptacoes:["Galaxy A20","Galaxy A30","Galaxy A50","Galaxy A50S","Galaxy M31","Galaxy M30S"]},
{marca:"Samsung",modelo:"Galaxy A31",adaptacoes:["Galaxy A22 4G","Galaxy A32 4G","Galaxy M31","Galaxy M32","Galaxy A33","Galaxy M22"]},
{marca:"Samsung",modelo:"Galaxy A32",adaptacoes:["Galaxy A22 4G","Galaxy A33","Galaxy M32","Poco M2"]},
{marca:"Samsung",modelo:"Galaxy A32 5G",adaptacoes:["Galaxy A22 5G","Galaxy M14","Galaxy A14"]},
{marca:"Samsung",modelo:"Galaxy A50S",adaptacoes:["Galaxy A20","Galaxy A30","Galaxy A50","Galaxy A30S"]},
{marca:"Samsung",modelo:"Galaxy A52",adaptacoes:["Galaxy A51","Galaxy A52S","Galaxy A53 5G","Galaxy S20 FE"]},
{marca:"Samsung",modelo:"Galaxy A52S",adaptacoes:["Galaxy A51","Galaxy A52","Galaxy A53 5G","Galaxy S20 FE"]},
{marca:"Samsung",modelo:"Galaxy A53 5G",adaptacoes:["Galaxy A52","Galaxy A52S","Galaxy S20 FE","Moto Edge 30","Poco M4 Pro 4G"]},
{marca:"Samsung",modelo:"Galaxy A55 5G",adaptacoes:["Galaxy A35","Galaxy M35","Galaxy A56"]},
{marca:"Samsung",modelo:"Galaxy A02",adaptacoes:["Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A03 Core","Galaxy A04","Galaxy A04S","Galaxy A04E","Galaxy A12","Galaxy A13","Galaxy M23","Galaxy A70","Redmi 9A","Redmi 9A Sport","Redmi 9i","Redmi 9C","Moto E7","Moto E7 Power","Poco M4"]},
{marca:"Samsung",modelo:"Galaxy A05",adaptacoes:["Galaxy A05S","Galaxy A06","Galaxy A07","Redmi 13C","Redmi C65","TCL 40","Realme C33","Realme Note 50","Realme Note 60"]},
{marca:"Samsung",modelo:"Galaxy A05S",adaptacoes:["Galaxy A05","Redmi 13C","Redmi C65","TCL 40","Realme C33","Realme Note 50","Realme Note 60"]},
{marca:"Samsung",modelo:"Galaxy A06",adaptacoes:["Galaxy A05","Galaxy A07","Redmi 13C","Redmi C65"]},
{marca:"Samsung",modelo:"Galaxy A10",adaptacoes:["Galaxy A10S","Galaxy M10","Moto G8 Play","Moto G8 Plus","Moto G7","LG K40S","Redmi 8","Redmi 8A"]},
{marca:"Samsung",modelo:"Galaxy A11",adaptacoes:["Moto G41","Moto G51","Moto G52","Redmi Note 10","Redmi 11 Lite","Redmi Note 9","Realme 7","Realme 7 Pro"]},
{marca:"Samsung",modelo:"Galaxy A12",adaptacoes:["Galaxy M12","Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03 Core","Galaxy A03S","Galaxy A04","Galaxy A04E","Galaxy A04S","Galaxy A13","Galaxy A23 5G","Galaxy A70","Moto E7","Moto E7 Power"]},
{marca:"Samsung",modelo:"Galaxy A13",adaptacoes:["Galaxy M13","Galaxy A12","Galaxy M12","Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03 Core","Galaxy A03S","Galaxy A04","Galaxy A04E","Galaxy A04S","Galaxy A23","Galaxy A70","Moto E7","Moto E7 Power"]},
{marca:"Samsung",modelo:"Galaxy A14",adaptacoes:["Galaxy A22 5G","Galaxy M14","Moto One Fusion","Galaxy A16 4G","Galaxy A16"]},
{marca:"Samsung",modelo:"Galaxy A15",adaptacoes:["Galaxy A25","Galaxy M15","Galaxy M24","Galaxy M25","Galaxy A34"]},
{marca:"Samsung",modelo:"Galaxy A16",adaptacoes:["Galaxy A14","Galaxy A17","Galaxy A26"]},
{marca:"Samsung",modelo:"Galaxy A17",adaptacoes:["Galaxy A16","Galaxy A26","Galaxy A14"]},
{marca:"Samsung",modelo:"Galaxy A20",adaptacoes:["Galaxy A30","Galaxy A50","Galaxy A30S","Galaxy A50S","Galaxy M31","Galaxy M30S"]},
{marca:"Samsung",modelo:"Galaxy A20S",adaptacoes:["Galaxy A32 5G","Moto One Fusion"]},
{marca:"Samsung",modelo:"Galaxy A21",adaptacoes:["Galaxy A21S","Galaxy A71","Moto G22","Redmi Note 11","Poco X3"]},
{marca:"Samsung",modelo:"Galaxy A22 4G",adaptacoes:["Galaxy A31","Galaxy A32 4G","Galaxy M31","Galaxy M32","Galaxy A33","Galaxy M22"]},
{marca:"Samsung",modelo:"Galaxy A22 5G",adaptacoes:["Galaxy A32 5G","Galaxy A14","Galaxy M14"]},
{marca:"Samsung",modelo:"Galaxy A23",adaptacoes:["Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03 Core","Galaxy A03S","Galaxy A04","Galaxy A04E","Galaxy A04S","Galaxy A70","Galaxy A32","Galaxy A22","Realme C2"]},
{marca:"Samsung",modelo:"Galaxy A24",adaptacoes:["iPhone 15 Pro Max","Galaxy A25","Galaxy A15","Galaxy M15"]},
{marca:"Samsung",modelo:"Galaxy A25",adaptacoes:["iPhone 15 Pro Max","Galaxy A24","Galaxy A15","Galaxy M15"]},
{marca:"Samsung",modelo:"Galaxy A26",adaptacoes:["Galaxy A16","Galaxy A17"]},
{marca:"Samsung",modelo:"Galaxy A32 4G",adaptacoes:["Galaxy A22 4G","Galaxy A33","Galaxy M32","Poco M2"]},
{marca:"Samsung",modelo:"Galaxy A33",adaptacoes:["Galaxy M21S","Galaxy M31","Galaxy M22","Galaxy M32","Galaxy A31","Galaxy A32 4G"]},
{marca:"Samsung",modelo:"Galaxy A34",adaptacoes:["iPhone 14 Pro Max","Galaxy M34","Galaxy M15"]},
{marca:"Samsung",modelo:"Galaxy A35",adaptacoes:["Galaxy A56","Galaxy S24 FE","Galaxy A55 5G","Galaxy M35"]},
{marca:"Samsung",modelo:"Galaxy A36",adaptacoes:["Galaxy A37","Galaxy A56","Galaxy S24 FE"]},
{marca:"Samsung",modelo:"Galaxy A37",adaptacoes:["Galaxy A36","Galaxy A56","Galaxy S24 FE"]},
{marca:"Samsung",modelo:"Galaxy A41",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy A50",adaptacoes:["Galaxy A20","Galaxy A30","Galaxy A50S","Galaxy A30S"]},
{marca:"Samsung",modelo:"Galaxy A51",adaptacoes:["Galaxy A52","Galaxy A52S","Galaxy A53 5G","Galaxy S20 FE"]},
{marca:"Samsung",modelo:"Galaxy A53",adaptacoes:["Galaxy A52S","Galaxy S20 FE","Moto Edge 30","Poco M4 Pro 4G"]},
{marca:"Samsung",modelo:"Galaxy A54",adaptacoes:["Galaxy S21 FE","Galaxy S23 FE"]},
{marca:"Samsung",modelo:"Galaxy A55",adaptacoes:["Galaxy A35","Galaxy M35"]},
{marca:"Samsung",modelo:"Galaxy A56",adaptacoes:["Galaxy A36","Galaxy S24 FE","Galaxy A57"]},
{marca:"Samsung",modelo:"Galaxy A57",adaptacoes:["Galaxy A36","Galaxy S24 FE","Galaxy A56"]},
{marca:"Samsung",modelo:"Galaxy A70",adaptacoes:["Galaxy A12","Galaxy M12","Galaxy A02","Galaxy A03","Galaxy A03S","Galaxy A03 Core","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy A71",adaptacoes:["Galaxy A21","Galaxy A21S","Moto G22","Redmi Note 11","Poco X3","Galaxy M62"]},
{marca:"Samsung",modelo:"Galaxy A72",adaptacoes:["Galaxy A52","Galaxy A52S","Galaxy S20 FE"]},
{marca:"Samsung",modelo:"Galaxy A73",adaptacoes:["Galaxy A53","Galaxy A54","Galaxy S21 FE"]},
{marca:"Samsung",modelo:"Galaxy A80",adaptacoes:["Infinix Note 12 Pro 5G"]},
{marca:"Samsung",modelo:"Galaxy M12",adaptacoes:["Galaxy A12","Galaxy A02","Galaxy A02S","Galaxy A03","Galaxy A03S","Galaxy A04","Galaxy A04S","Galaxy A13"]},
{marca:"Samsung",modelo:"Galaxy M13",adaptacoes:["Galaxy A13","Galaxy A12","Galaxy A04","Galaxy A04S"]},
{marca:"Samsung",modelo:"Galaxy M14",adaptacoes:["Galaxy A14","Galaxy A22 5G"]},
{marca:"Samsung",modelo:"Galaxy M15",adaptacoes:["Galaxy A15","Galaxy A24","Galaxy A25"]},
{marca:"Samsung",modelo:"Galaxy M10",adaptacoes:["Galaxy A10","Galaxy A10S","Moto G8 Play","Moto G8 Plus"]},
{marca:"Samsung",modelo:"Galaxy M20",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy M21S",adaptacoes:["Galaxy A20","Galaxy M31","Galaxy A30","Galaxy A50","Galaxy A30s","Galaxy A50s"]},
{marca:"Samsung",modelo:"Galaxy M24",adaptacoes:["Galaxy A15","Galaxy A24","Galaxy A25","Galaxy M15"]},
{marca:"Samsung",modelo:"Galaxy M25",adaptacoes:["Galaxy A15","Galaxy A24","Galaxy A25","Galaxy M15"]},
{marca:"Samsung",modelo:"Galaxy M30S",adaptacoes:["Galaxy A20","Galaxy A30","Galaxy A50","Galaxy A30S","Galaxy M31"]},
{marca:"Samsung",modelo:"Galaxy S20 FE",adaptacoes:["Galaxy A51","Galaxy A52","Galaxy A52S","Galaxy A53 5G"]},
{marca:"Samsung",modelo:"Galaxy S21 FE",adaptacoes:["Galaxy A54","Galaxy A73","Galaxy S23 FE"]},
{marca:"Samsung",modelo:"Galaxy S23 FE",adaptacoes:["Galaxy A54","Galaxy S21 FE"]},

/* ===== Modelos que já eram citados como adaptação de outros aparelhos, mas ainda
   não tinham ficha própria (por isso não apareciam numa busca direta pelo nome
   deles). Geradas automaticamente a partir das relações já existentes no arquivo,
   revise se quiser completar com mais compatibilidades. ===== */
{marca:"Xiaomi",modelo:"Redmi C65",adaptacoes:["Galaxy A07","Galaxy A05","Galaxy A05S","Galaxy A06","TCL 40"]},
{marca:"Motorola",modelo:"Moto G8 Play",adaptacoes:["Galaxy A10S","Galaxy A10","Galaxy M10","Moto G8 Plus","Moto One Macro","LG K40S"]},
{marca:"Xiaomi",modelo:"Redmi 8",adaptacoes:["Galaxy A10S","Galaxy A10","LG K40S"]},
{marca:"Xiaomi",modelo:"Redmi 8A",adaptacoes:["Galaxy A10S","Galaxy A10","LG K40S"]},
{marca:"Xiaomi",modelo:"Poco X3",adaptacoes:["Galaxy A21S","Galaxy A21","Galaxy A71","Redmi Mi 11i","Poco X3 GT","Poco X4","Poco X4 Pro","Poco X4 GT","LG K61"]},
{marca:"Xiaomi",modelo:"Poco M4 Pro 4G",adaptacoes:["Galaxy A53 5G","Galaxy A53"]},
{marca:"Xiaomi",modelo:"Redmi 11 Lite",adaptacoes:["Galaxy A11"]},
{marca:"Realme",modelo:"Realme 7 Pro",adaptacoes:["Galaxy A11"]},
{marca:"Motorola",modelo:"Moto G04",adaptacoes:["Moto E14","Infinix Smart 8","Infinix Smart 8 Pro","Infinix Hot 40i"]},
{marca:"Motorola",modelo:"Moto G24",adaptacoes:["Moto E14","Infinix Smart 8","Infinix Smart 8 Pro","Infinix Hot 40","Infinix Hot 40i"]},
{marca:"Motorola",modelo:"Moto G05",adaptacoes:["Moto E15","Moto G17","Moto G35","Moto G56","Realme C75"]},
{marca:"Motorola",modelo:"Moto G15",adaptacoes:["Moto E15","Moto G17","Moto G35","Moto G56","Infinix Note 60i","Realme C75"]},
{marca:"Motorola",modelo:"Moto E5",adaptacoes:["Moto G5G Plus"]},
{marca:"Motorola",modelo:"Moto 9 Play",adaptacoes:["Moto G9"]},
{marca:"Apple",modelo:"iPhone SE 2ºG",adaptacoes:["iPhone 7•8"]},
{marca:"Apple",modelo:"iPhone XS",adaptacoes:["iPhone X"]},
{marca:"Apple",modelo:"iPhone 11 Pro",adaptacoes:["iPhone X"]},
{marca:"Apple",modelo:"iPhone 11 Pro Max",adaptacoes:["iPhone XS Max"]},
{marca:"Apple",modelo:"iPhone 13",adaptacoes:["iPhone 14","iPhone 16E"]},
{marca:"Apple",modelo:"iPhone 13 Pro",adaptacoes:["iPhone 16E"]},
{marca:"Xiaomi",modelo:"Redmi 13",adaptacoes:["Redmi 12","Poco C65"]},
{marca:"Xiaomi",modelo:"Redmi Poco M6",adaptacoes:["Redmi 12","Poco C65","Redmi 12•13"]},
{marca:"Xiaomi",modelo:"Redmi Mi 8 Lite",adaptacoes:["Redmi 8 Lite","Xiaomi Note 6 Pro"]},
{marca:"Xiaomi",modelo:"Poco X3 Pro",adaptacoes:["Redmi Mi 11i","Poco X3 GT","Poco X4","Poco X4 Pro","Poco X4 GT","LG K61"]},
{marca:"Xiaomi",modelo:"Redmi Note 8",adaptacoes:["Redmi Note 7"]},
{marca:"Xiaomi",modelo:"Poco X6",adaptacoes:["Poco X6 Pro","Poco F6•F6 Pro"]},
{marca:"Xiaomi",modelo:"Redmi Note 13",adaptacoes:["Redmi Note 13 Pro","Redmi 13T","Redmi 13T Pro"]},
{marca:"Xiaomi",modelo:"Redmi MI 13T",adaptacoes:["Redmi Note 13 Pro","Redmi Note 13•13 Pro"]},
{marca:"Xiaomi",modelo:"Redmi MI 13T Pro",adaptacoes:["Redmi Note 13 Pro","Redmi Note 13•13 Pro"]},
{marca:"Xiaomi",modelo:"Redmi 10",adaptacoes:["Poco M3 Pro"]},
{marca:"Xiaomi",modelo:"Xiaomi 12T",adaptacoes:["Xiaomi 14T"]},
{marca:"Samsung",modelo:"Galaxy M21",adaptacoes:["Galaxy A21","Galaxy A21S"]},
{marca:"Samsung",modelo:"Galaxy M22",adaptacoes:["Galaxy A22","Galaxy A32 4G"]},
{marca:"Samsung",modelo:"Galaxy M23",adaptacoes:["Galaxy A13","Galaxy A23","Galaxy A32 5G"]},
{marca:"Samsung",modelo:"Galaxy M31",adaptacoes:["Galaxy A20","Galaxy A30","Galaxy A31","Galaxy A32"]},
{marca:"Samsung",modelo:"Galaxy M32",adaptacoes:["Galaxy A22","Galaxy A32 4G"]},
{marca:"Samsung",modelo:"Galaxy M34",adaptacoes:["Galaxy A34","Galaxy A54"]},
{marca:"Samsung",modelo:"Galaxy M35",adaptacoes:["Galaxy A35","Galaxy A55"]},
{marca:"Samsung",modelo:"Galaxy M51",adaptacoes:["Galaxy M62"]},
{marca:"Samsung",modelo:"Galaxy M52",adaptacoes:["Galaxy M62"]},
{marca:"Samsung",modelo:"Galaxy M54",adaptacoes:["Galaxy M62"]},
{marca:"Samsung",modelo:"Galaxy M55",adaptacoes:["Galaxy M62"]},
{marca:"Samsung",modelo:"Galaxy M62",adaptacoes:["Galaxy M51","Galaxy M52","Galaxy M54","Galaxy M55","Galaxy A71"]},
{marca:"Samsung",modelo:"Galaxy S8•S9",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S8 Plus•S9 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S10",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S10 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S10E",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S10 Lite",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S20",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S20 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S20 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S21",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S21 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S21 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S22",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S22 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S22 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S23",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S23 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S24",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S24 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S24 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S24 FE",adaptacoes:["Galaxy A35","Galaxy A36","Galaxy A56","Galaxy A57"]},
{marca:"Samsung",modelo:"Galaxy S25",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S25 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S25 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S25 FE",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S26",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S26 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S26 Ultra",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy S26 Edge",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy Note 10",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy Note 10 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy Note 10 Lite",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy Note 20",adaptacoes:["Sem Adaptação"]},
{marca:"Samsung",modelo:"Galaxy Note 20 Ultra",adaptacoes:["Sem Adaptação"]},

/* ================= MOTOROLA ================= */
{marca:"Motorola",modelo:"Moto E5 Play",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto E5 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto E6",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto E6i",adaptacoes:["Moto E6S","Moto E6 Plus","Moto E7","Moto E20","Moto G9 Play","Moto E7 Power","Galaxy A13","Galaxy A23","Galaxy A12","Moto G30"]},
{marca:"Motorola",modelo:"Moto E6 Plus",adaptacoes:["Moto E6i","Moto E6S","Moto E7","Moto E20","Moto G9 Play","Moto E7 Power","Galaxy A13","Galaxy A23","Galaxy A12","Moto G30"]},
{marca:"Motorola",modelo:"Moto E6S",adaptacoes:["Moto E6i","Moto E6 Plus","Moto E7","Moto E20","Moto G9 Play","Moto E7 Power","Galaxy A13","Galaxy A23","Galaxy A12","Moto G30","Moto E20"]},
{marca:"Motorola",modelo:"Moto E7 Power",adaptacoes:["Moto E7","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy A13","Galaxy M12","Moto E6i","Moto E6 Plus","Moto E6S"]},
{marca:"Motorola",modelo:"Moto E7",adaptacoes:["Moto E7 Power","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy A13","Galaxy M12"]},
{marca:"Motorola",modelo:"Moto E14",adaptacoes:["Moto G04","Moto G24","Moto G34"]},
{marca:"Motorola",modelo:"Moto E30",adaptacoes:["Moto E13","Moto E20","Moto G9 Play","Galaxy A02S","Moto G30","Moto E7 Power","Moto One Fusion","Realme C11","Galaxy A12","Galaxy A70"]},
{marca:"Motorola",modelo:"Moto E7 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto E13",adaptacoes:["Moto E20","Moto E30","Moto G9 Play","Galaxy A02S","Moto G30","Moto E7 Power","Moto One Fusion","Realme C11","Galaxy A12","Galaxy A70"]},
{marca:"Motorola",modelo:"Moto E15",adaptacoes:["Moto G05","Moto G15","Moto G35"]},
{marca:"Motorola",modelo:"Moto E20",adaptacoes:["Galaxy A07","Moto E7","Redmi 9A","Redmi 9A Sport","Redmi 9i","Galaxy A12","Galaxy M34","Galaxy M12"]},
{marca:"Motorola",modelo:"Moto E22",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto E32",adaptacoes:["Moto G22","Moto Edge 20"]},
{marca:"Motorola",modelo:"Moto E40",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G 5G",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G 5G PLus",adaptacoes:["Moto G100"]},
{marca:"Motorola",modelo:"Moto G04•G24",adaptacoes:["Moto G34","Moto E14"]},
{marca:"Motorola",modelo:"Moto G5",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G5S",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G5S Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G5 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G05•G15",adaptacoes:["Moto G17","Moto G35","Moto G56"]},
{marca:"Motorola",modelo:"Moto G5G",adaptacoes:["Moto Edge 20"]},
{marca:"Motorola",modelo:"Moto G5G Plus",adaptacoes:["Moto E5"]},
{marca:"Motorola",modelo:"G06",adaptacoes:["Redmi 14C","Poco C75","Poco C71","Redmi A5"]},
{marca:"Motorola",modelo:"Moto G6",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G6 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G6 Play",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G7",adaptacoes:["Moto G7 Plus"]},
{marca:"Motorola",modelo:"Moto G7 Plus",adaptacoes:["Moto G7","Moto G8 Power"]},
{marca:"Motorola",modelo:"Moto G7 Play",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G7 Power",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G8",adaptacoes:["Moto G8 Power Lite","Moto G9 Play"]},
{marca:"Motorola",modelo:"Moto G8 Plus",adaptacoes:["Moto G8 Play","Moto One Macro","Moto G8 Power"]},
{marca:"Motorola",modelo:"Moto G8 Power",adaptacoes:["Moto G7 Plus","Moto G8 Plus"]},
{marca:"Motorola",modelo:"Moto G9 Play",adaptacoes:["Moto G8","Moto G8 Power Lite","Moto G10","Moto G20","Moto G30","Moto E20","Galaxy A12","Moto E6i","Moto E6 Plus","Moto E6S","Moto E7 Power"]},
{marca:"Motorola",modelo:"Moto G20",adaptacoes:["Moto G10","Moto G10 Power","Moto G30","Moto G8 Power Lite","Galaxy A12","Galaxy A70","Moto G9 Play"]},
{marca:"Motorola",modelo:"Moto G30",adaptacoes:["Moto G10","Moto G10 Power","Moto G20","Moto G8 Power Lite","Galaxy A12","Galaxy A70","Moto E6i","Moto E6 Plus","Moto E6S","Moto E13","Moto E30"]},
{marca:"Motorola",modelo:"Moto G41",adaptacoes:["Moto G31","Moto G71","Redmi Note 9S","Redmi Note 9 Pro"]},
{marca:"Motorola",modelo:"Moto G45",adaptacoes:["Moto G34","Moto G13"]},
{marca:"Motorola",modelo:"Moto G53 5G",adaptacoes:["Moto G23","Moto G13","Moto G53"]},
{marca:"Motorola",modelo:"Moto G60S",adaptacoes:["Moto G60","Redmi 10C","Moto G9+"]},
{marca:"Motorola",modelo:"Moto G84 5G",adaptacoes:["Moto G54","Moto G14","Moto G84"]},
{marca:"Motorola",modelo:"Moto G9+",adaptacoes:["Moto G60","Redmi 10C","Moto G60S","Moto G200"]},
{marca:"Motorola",modelo:"Moto Edge 20 Lite",adaptacoes:["Moto Edge 20","Moto Edge 30X","Moto Edge 30 Pro"]},
{marca:"Motorola",modelo:"Moto Edge 30 Pro",adaptacoes:["Moto Edge 20 Lite","Moto Edge 30X","Moto Edge 20"]},
{marca:"Motorola",modelo:"Moto Edge 30X",adaptacoes:["Moto Edge 20 Lite","Moto Edge 30 Pro","Moto Edge 20"]},
{marca:"Motorola",modelo:"Moto One Action",adaptacoes:["Moto One Avision"]},
{marca:"Motorola",modelo:"Moto One Macro",adaptacoes:["Moto G8 Play","Moto G8 Plus"]},
{marca:"Motorola",modelo:"Moto G8 Power Lite",adaptacoes:["Moto G8","Moto G9 Play","Moto G10","Moto G20","Moto G30","Moto E20","Galaxy A12"]},
{marca:"Motorola",modelo:"Moto G9",adaptacoes:["Moto 9 Play","Redmi 9A","Redmi 9A Sport","Redmi 9i","Galaxy A23 5G","Galaxy A32 5G","Moto G20","Moto G30","Moto G50","Moto G10 Power","Moto One Fusion","Galaxy M12"]},
{marca:"Motorola",modelo:"Moto G9 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G9 Power",adaptacoes:["Moto G200"]},
{marca:"Motorola",modelo:"Moto G10",adaptacoes:["Moto G10 Power","Moto G20","Moto G30","Moto G8 Power Lite","Galaxy A12","Galaxy A70"]},
{marca:"Motorola",modelo:"Moto G10 Power",adaptacoes:["Galaxy A12","Galaxy A70","Redmi 9A","Redmi 9C","Redmi 9A Sport"]},
{marca:"Motorola",modelo:"Moto G13",adaptacoes:["Moto G14","Moto G23","Moto G53","Moto G42","Moto G62"]},
{marca:"Motorola",modelo:"Moto G14",adaptacoes:["Moto G62","Moto G53","Moto G54"]},
{marca:"Motorola",modelo:"Moto G17",adaptacoes:["Moto G05","Moto G15","Moto G35","Moto G56"]},
{marca:"Motorola",modelo:"Moto G22",adaptacoes:["Moto G51","Moto G53","Moto G71"]},
{marca:"Motorola",modelo:"Moto G23",adaptacoes:["Moto G53 5G"]},
{marca:"Motorola",modelo:"Moto G31",adaptacoes:["Moto G41","Moto G71"]},
{marca:"Motorola",modelo:"Moto G32",adaptacoes:["Moto G53"]},
{marca:"Motorola",modelo:"Moto G34",adaptacoes:["Moto G13","Moto G45","Moto G73"]},
{marca:"Motorola",modelo:"Moto G35",adaptacoes:["Poco X5","Moto G53","Moto G05","Moto G15"]},
{marca:"Motorola",modelo:"Moto G40",adaptacoes:["Moto G40 Fusion","Redmi 10 Prime","Redmi Mi 11 Lite"]},
{marca:"Motorola",modelo:"Moto G40 Fusion",adaptacoes:["Moto G40","Redmi 10 Prime","Redmi Mi 11 Lite"]},
{marca:"Motorola",modelo:"Moto G42",adaptacoes:["Moto G52","Moto G71","Galaxy A53","Redmi Note 10","Galaxy A11"]},
{marca:"Motorola",modelo:"Moto G50",adaptacoes:["Moto G8 Power Lite"]},
{marca:"Motorola",modelo:"Moto G51",adaptacoes:["Moto G22","Galaxy A11"]},
{marca:"Motorola",modelo:"Moto G52",adaptacoes:["Moto G82"]},
{marca:"Motorola",modelo:"Moto G53",adaptacoes:["Moto G13","Moto G22","Moto G23","Moto G32","Moto G34","Redmi Note 10 5G"]},
{marca:"Motorola",modelo:"Moto G54",adaptacoes:["Moto G23","Moto G13"]},
{marca:"Motorola",modelo:"Moto G55",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G56",adaptacoes:["Moto G35","Moto G75","Moto G05","Moto G15"]},
{marca:"Motorola",modelo:"Moto G60",adaptacoes:["Moto G60S","Redmi 10C","Moto G9+"]},
{marca:"Motorola",modelo:"Moto G62",adaptacoes:["Moto G14"]},
{marca:"Motorola",modelo:"Moto G67",adaptacoes:["iPhone 17 Pro Max"]},
{marca:"Motorola",modelo:"Moto G71",adaptacoes:["Moto G41","Moto G31","Moto G42"]},
{marca:"Motorola",modelo:"Moto G72",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G73",adaptacoes:["Moto G34"]},
{marca:"Motorola",modelo:"Moto G75",adaptacoes:["Moto G56"]},
{marca:"Motorola",modelo:"Moto G82",adaptacoes:["Moto G52","Moto G84 5G"]},
{marca:"Motorola",modelo:"Moto G84",adaptacoes:["Moto G54","Moto G14"]},
{marca:"Motorola",modelo:"Moto G86",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G100",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto G200",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto Edge 20",adaptacoes:["Moto Edge 30X","Moto Edge 30 Pro","Moto Edge 20 Lite"]},
{marca:"Motorola",modelo:"Moto Edge 20 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto Edge 30",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto Edge 30 Neo",adaptacoes:["Moto Edge 50 Neo"]},
{marca:"Motorola",modelo:"Moto Edge 50 Neo",adaptacoes:["Moto Edge 30 Neo"]},
{marca:"Motorola",modelo:"Moto Edge 60",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto One",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto One Avision",adaptacoes:["Moto One Action"]},
{marca:"Motorola",modelo:"Moto One Fusion",adaptacoes:["Moto G10","Moto G10 Power","Moto G20","Moto G30","Moto G40","Redmi 9A","Redmi 9i","Redmi 9A Sport","Galaxy A23"]},
{marca:"Motorola",modelo:"Moto One Fusion Plus",adaptacoes:["Galaxy M52"]},
{marca:"Motorola",modelo:"Moto One Hyper",adaptacoes:["Redmi Note 7","Moto G71","Galaxy A53","Moto G41","Moto G52","Redmi Mi 11 Lite"]},
{marca:"Motorola",modelo:"Moto One Zoom",adaptacoes:["Galaxy A10","Moto G8+","Moto G8 Plus"]},
{marca:"Motorola",modelo:"Moto Z2 Play",adaptacoes:["Sem Adaptação"]},
{marca:"Motorola",modelo:"Moto Z3 Play",adaptacoes:["Sem Adaptação"]},

/* ================= APPLE ================= */
{marca:"Apple",modelo:"iPhone 5•SE 1ºG",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 6•6S",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 6 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 7•8",adaptacoes:["iPhone SE 2ºG"]},
{marca:"Apple",modelo:"iPhone 7 Plus•8 Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone X",adaptacoes:["iPhone XS","iPhone 11 Pro"]},
{marca:"Apple",modelo:"iPhone XS Max",adaptacoes:["iPhone 11 Pro Max"]},
{marca:"Apple",modelo:"iPhone XR•11",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 12•12 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 12 Pro Max",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 12 Mini",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 13•13 Pro",adaptacoes:["iPhone 14","iPhone 16E"]},
{marca:"Apple",modelo:"iPhone 13 Pro Max",adaptacoes:["iPhone 14 Plus"]},
{marca:"Apple",modelo:"iPhone 13 Mini",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 14",adaptacoes:["iPhone 13","iPhone 16E"]},
{marca:"Apple",modelo:"iPhone 14 Pro",adaptacoes:["iPhone 16"]},
{marca:"Apple",modelo:"iPhone 14 Plus",adaptacoes:["iPhone 13 Pro Max","iPhone 15 Plus"]},
{marca:"Apple",modelo:"iPhone 14 Pro Max",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 15",adaptacoes:["iPhone 16"]},
{marca:"Apple",modelo:"iPhone 15 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 15 Plus",adaptacoes:["iPhone 14 Plus","iPhone 15 Pro Max","iPhone 16 Plus"]},
{marca:"Apple",modelo:"iPhone 15 Pro Max",adaptacoes:["iPhone 15 Plus","iPhone 16 Plus"]},
{marca:"Apple",modelo:"iPhone 16",adaptacoes:["iPhone 14 Pro"]},
{marca:"Apple",modelo:"iPhone 16 Pro",adaptacoes:["iPhone 17"]},
{marca:"Apple",modelo:"iPhone 16 Plus",adaptacoes:["iPhone 15 Plus","iPhone 15 Pro Max"]},
{marca:"Apple",modelo:"iPhone 16 Pro Max",adaptacoes:["iPhone 17 Pro Max"]},
{marca:"Apple",modelo:"iPhone 16E",adaptacoes:["iPhone 13","iPhone 13 Pro","iPhone 14"]},
{marca:"Apple",modelo:"iPhone 17",adaptacoes:["iPhone 16 Pro"]},
{marca:"Apple",modelo:"iPhone 17 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Apple",modelo:"iPhone 17 Pro Max",adaptacoes:["iPhone 16 Pro Max","Poco X8 Pro Max"]},
{marca:"Apple",modelo:"iPhone 17 Air",adaptacoes:["Sem Adaptação"]},

/* ================= XIAOMI / REDMI / POCO ================= */
{marca:"Xiaomi",modelo:"Redmi 6A•7A",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi A1•A2",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi A3",adaptacoes:["Redmi 10C","Redmi 12C","Poco C61"]},
{marca:"Xiaomi",modelo:"Redmi 9",adaptacoes:["Redmi 9T"]},
{marca:"Xiaomi",modelo:"Redmi 9A",adaptacoes:["Redmi 9C","Redmi 9i","Redmi 9A Sport","Redmi 10A","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy M12","Moto E7","Moto E20","Moto G9","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi 9C",adaptacoes:["Redmi 9A","Redmi 9i","Redmi 9A Sport","Redmi 10A","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy M12","Moto E7","Moto E20","Moto G9","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi 9i",adaptacoes:["Redmi 9A","Redmi 9C","Redmi 9A Sport","Redmi 10A","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy M12","Moto E7","Moto E20","Moto G9","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi 9A Sport",adaptacoes:["Redmi 9A","Redmi 9C","Redmi 9i","Redmi 10A","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy M12","Moto E7","Moto E20","Moto G9","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi 10A",adaptacoes:["Redmi 9A","Redmi 9C","Redmi 9i","Redmi 9A Sport","Galaxy A02","Galaxy A03","Galaxy A12","Galaxy M12","Moto E7","Moto E20","Moto G9","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi 10 Prime",adaptacoes:["Moto G40","Moto G40 Fusion","Redmi Mi 11 Lite","Redmi 10A"]},
{marca:"Xiaomi",modelo:"Redmi 11 Prime",adaptacoes:["Poco M4","Redmi 10A","Redmi A1","Redmi A1+"]},
{marca:"Xiaomi",modelo:"Redmi 12",adaptacoes:["Redmi 13","Redmi Poco C65","Redmi Poco M6","Poco M6 Pro"]},
{marca:"Xiaomi",modelo:"Redmi A1",adaptacoes:["Redmi A1+","Redmi A2","Redmi 11 Prime","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi A1+",adaptacoes:["Redmi A1","Redmi A2","Redmi 11 Prime","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi A2",adaptacoes:["Redmi A1","Redmi A1+","Redmi 11 Prime","Poco M4"]},
{marca:"Xiaomi",modelo:"Redmi A5",adaptacoes:["Redmi 14C","Poco C75","Poco C71","Moto G06"]},
{marca:"Xiaomi",modelo:"Redmi 8 Lite",adaptacoes:["Note 6 Pro","Redmi Mi 8 Lite"]},
{marca:"Xiaomi",modelo:"Redmi Mi 11 Lite",adaptacoes:["Moto G40","Moto G40 Fusion","Redmi 10 Prime","Moto One Hyper"]},
{marca:"Xiaomi",modelo:"Redmi Mi 11i",adaptacoes:["Poco X3","Poco X3 Pro","Poco X4","Poco X4 Pro","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","LG K61"]},
{marca:"Xiaomi",modelo:"Redmi Note 7",adaptacoes:["Redmi Note 8","Galaxy A10","Galaxy A20","Galaxy A30","Moto G7","Moto One Hyper"]},
{marca:"Xiaomi",modelo:"Poco C61",adaptacoes:["Redmi A3"]},
{marca:"Xiaomi",modelo:"Poco C65",adaptacoes:["Redmi 13C","Redmi 12","Redmi 13","Redmi Poco M6"]},
{marca:"Xiaomi",modelo:"Poco C71",adaptacoes:["Redmi 14C","Poco C75","Redmi A5","Moto G06"]},
{marca:"Xiaomi",modelo:"Poco C75",adaptacoes:["Redmi 14C","Poco C71","Redmi A5","Moto G06"]},
{marca:"Xiaomi",modelo:"Poco C85",adaptacoes:["Redmi 15C"]},
{marca:"Xiaomi",modelo:"Poco M5",adaptacoes:["Poco M4","Redmi 9A","Redmi 9i","Redmi 9C","Redmi 9A Sport","Redmi 10A","Redmi A1","Redmi A1+","Redmi A2","Redmi 11 Prime","Galaxy A02"]},
{marca:"Xiaomi",modelo:"Poco X3 GT",adaptacoes:["Poco X3","Poco X3 Pro","Poco X4","Poco X4 Pro","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i","LG K61"]},
{marca:"Xiaomi",modelo:"Poco X4",adaptacoes:["Poco X3","Poco X3 Pro","Poco X3 GT","Poco X4 Pro","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i","LG K61"]},
{marca:"Xiaomi",modelo:"Poco X4 Pro",adaptacoes:["Poco X3","Poco X3 Pro","Poco X3 GT","Poco X4","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i","LG K61"]},
{marca:"Xiaomi",modelo:"Poco X4 GT",adaptacoes:["Poco X3","Poco X3 Pro","Poco X3 GT","Poco X4","Poco X4 Pro","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i","LG K61"]},
{marca:"Xiaomi",modelo:"Poco X6 Pro",adaptacoes:["Poco X6","Poco X7 Pro","Redmi Note 10 Pro","Redmi Note 11 Pro"]},
{marca:"Xiaomi",modelo:"Poco F4",adaptacoes:["Poco F3","Poco F5","Redmi Note 11 5G"]},
{marca:"Xiaomi",modelo:"Poco F5",adaptacoes:["Poco F3","Poco F4","Poco F5 Pro","Redmi Note 11 5G"]},
{marca:"Xiaomi",modelo:"Redmi Note 11 5G",adaptacoes:["Poco F3","Poco F4","Poco F5","Redmi Note 11 Pro"]},
{marca:"Xiaomi",modelo:"Redmi Note 13 Pro",adaptacoes:["Redmi Note 13","Redmi Note 14","Redmi MI 13T","Redmi MI 13T Pro"]},
{marca:"Xiaomi",modelo:"Redmi 13T",adaptacoes:["Redmi Note 13","Redmi Note 13 Pro","Redmi Note 14","Redmi 13T Pro","Xiaomi 14T"]},
{marca:"Xiaomi",modelo:"Redmi 13T Pro",adaptacoes:["Redmi Note 13","Redmi Note 13 Pro","Redmi Note 14","Redmi 13T","Xiaomi 14T"]},
{marca:"Xiaomi",modelo:"Redmi 14",adaptacoes:["Redmi Note 14","Redmi 13T","Redmi 13T Pro"]},
{marca:"Xiaomi",modelo:"Redmi 9T",adaptacoes:["Redmi 9"]},
{marca:"Xiaomi",modelo:"Redmi 10C",adaptacoes:["Redmi A3","Redmi 12C","Galaxy A05"]},
{marca:"Xiaomi",modelo:"Redmi 12•13",adaptacoes:["Redmi Poco C65","Redmi Poco M6"]},
{marca:"Xiaomi",modelo:"Redmi 12C",adaptacoes:["Redmi A3","Redmi 10C","Galaxy A05","Galaxy A15","Moto G23","Moto G34"]},
{marca:"Xiaomi",modelo:"Redmi 13C",adaptacoes:["Poco C65","Galaxy A05","Galaxy A05S","Galaxy A06","Galaxy A07"]},
{marca:"Xiaomi",modelo:"Redmi 14C",adaptacoes:["Poco C75","Poco C71","Redmi A5","Moto G06"]},
{marca:"Xiaomi",modelo:"Redmi 15",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi 15C",adaptacoes:["Poco C85"]},
{marca:"Xiaomi",modelo:"Note 6 Pro",adaptacoes:["Redmi Mi 8 Lite"]},
{marca:"Xiaomi",modelo:"Redmi Note 7•8",adaptacoes:["Galaxy A10","Galaxy A20","Galaxy A30","Moto G7"]},
{marca:"Xiaomi",modelo:"Redmi Note 8T",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi Note 8 Pro",adaptacoes:["Galaxy A30","Galaxy A50","Moto G8 Power"]},
{marca:"Xiaomi",modelo:"Redmi Note 9",adaptacoes:["Galaxy A11","Galaxy A21","Moto G22","Moto G31"]},
{marca:"Xiaomi",modelo:"Redmi Note 9S",adaptacoes:["Galaxy A31","Galaxy A32","Moto G40","Moto G41"]},
{marca:"Xiaomi",modelo:"Redmi Note 9 Pro",adaptacoes:["Galaxy A31","Galaxy A32","Moto G40","Moto G41"]},
{marca:"Xiaomi",modelo:"Redmi Note 10",adaptacoes:["Redmi Note 11","Redmi Note 11S","Redmi Note 12","Galaxy A11","Galaxy A21","Moto G22"]},
{marca:"Xiaomi",modelo:"Redmi Note 10 5G",adaptacoes:["Moto G13","Moto G53"]},
{marca:"Xiaomi",modelo:"Redmi Note 10S",adaptacoes:["Galaxy A32","Galaxy A33","Moto G52"]},
{marca:"Xiaomi",modelo:"Redmi Note 10 Pro",adaptacoes:["Redmi Note 11 Pro","Galaxy A52","Galaxy A52S","Galaxy S20 FE","Moto G82"]},
{marca:"Xiaomi",modelo:"Redmi Note 11",adaptacoes:["Redmi Note 10","Redmi Note 11S","Redmi Note 12","Galaxy A21","Galaxy A71","Moto G22"]},
{marca:"Xiaomi",modelo:"Redmi Note 11S",adaptacoes:["Redmi Note 10","Redmi Note 11","Redmi Note 12","Galaxy A32","Galaxy A33","Moto G52"]},
{marca:"Xiaomi",modelo:"Redmi Note 11 Pro",adaptacoes:["Redmi Note 10 Pro","Galaxy A52","Galaxy A53","Moto G82"]},
{marca:"Xiaomi",modelo:"Redmi Note 11 Pro 5G",adaptacoes:["Galaxy A53","Galaxy A54","Moto G82"]},
{marca:"Xiaomi",modelo:"Redmi Note 12",adaptacoes:["Galaxy A23","Galaxy A33","Moto G32"]},
{marca:"Xiaomi",modelo:"Redmi Note 12S",adaptacoes:["Redmi Note 10","Redmi Note 11","Redmi Note 11S","Galaxy A33","Galaxy A34","Moto G52"]},
{marca:"Xiaomi",modelo:"Redmi Note 12 Pro",adaptacoes:["Galaxy A53","Galaxy A54","Moto G82"]},
{marca:"Xiaomi",modelo:"Redmi Note 12 Pro 5G",adaptacoes:["Galaxy A54","Galaxy A55","Moto G84"]},
{marca:"Xiaomi",modelo:"Redmi Note 13•13 Pro",adaptacoes:["Redmi MI 13T","Redmi MI 13T Pro","Redmi Note 14"]},
{marca:"Xiaomi",modelo:"Redmi Note 13 Pro Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi Note 14",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Redmi Note 14 Pro•14 Pro Plus",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Poco X3•X3 Pro",adaptacoes:["Poco X3 GT","Poco X4","Poco X4 Pro","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i","LG K61"]},
{marca:"Xiaomi",modelo:"Poco X4•X4 Pro",adaptacoes:["Poco X4 GT"]},
{marca:"Xiaomi",modelo:"Poco X5",adaptacoes:["Redmi Note 12"]},
{marca:"Xiaomi",modelo:"Poco X5 Pro",adaptacoes:["Redmi Note 12 Pro","Poco F5 Pro"]},
{marca:"Xiaomi",modelo:"Poco X6•X6 Pro",adaptacoes:["Redmi Note 10 Pro","Redmi Note 11 Pro","Poco X7 Pro"]},
{marca:"Xiaomi",modelo:"Poco X7 Pro",adaptacoes:["Poco X6 Pro","Redmi Note 10 Pro","Redmi Note 11 Pro"]},
{marca:"Xiaomi",modelo:"Poco X8",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Poco X8 Pro",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Poco X8 Pro Max",adaptacoes:["iPhone 17 Pro Max"]},
{marca:"Xiaomi",modelo:"Poco F1",adaptacoes:["Sem Adaptação"]},
{marca:"Xiaomi",modelo:"Poco F3",adaptacoes:["Poco F4","Poco F5","Redmi Note 11 5G"]},
{marca:"Xiaomi",modelo:"Poco F5 Pro",adaptacoes:["Poco X5 Pro","Redmi Note 12 Pro"]},
{marca:"Xiaomi",modelo:"Poco F6•F6 Pro",adaptacoes:["Poco X6","Poco X6 Pro"]},
{marca:"Xiaomi",modelo:"Poco F7",adaptacoes:["iPhone 16 Pro Max"]},
{marca:"Xiaomi",modelo:"Poco C3",adaptacoes:["Realme C33"]},
{marca:"Xiaomi",modelo:"Poco M2",adaptacoes:["Galaxy A22 4G","Galaxy A33","Galaxy A32 4G"]},
{marca:"Xiaomi",modelo:"Poco M3",adaptacoes:["Galaxy A32 5G","Redmi 9T"]},
{marca:"Xiaomi",modelo:"Poco M3 Pro",adaptacoes:["Redmi 10","Redmi 10 Prime","Moto G14","Moto G54","Moto G34","Moto G42"]},
{marca:"Xiaomi",modelo:"Poco M4",adaptacoes:["Moto E13","Poco M5","Redmi 9A","Redmi 9i","Redmi 9C","Redmi 9A Sport","Redmi 10A","Redmi A1","Redmi A1+","Redmi A2","Redmi 11 Prime","Galaxy A02"]},
{marca:"Xiaomi",modelo:"Poco M6 5G",adaptacoes:["Redmi 13C"]},
{marca:"Xiaomi",modelo:"Poco M6 Pro",adaptacoes:["Redmi 12"]},
{marca:"Xiaomi",modelo:"14T",adaptacoes:["Xiaomi 12T"]},
{marca:"Xiaomi",modelo:"Mi Play",adaptacoes:["Galaxy A01"]},

/* ================= INFINIX ================= */
{marca:"Infinix",modelo:"Smart 7",adaptacoes:["Galaxy A03","Galaxy A04","Moto E7","Moto G9"]},
{marca:"Infinix",modelo:"Smart 8",adaptacoes:["Moto G04","Moto G24","Redmi Note 13 Pro"]},
{marca:"Infinix",modelo:"Smart 8 Pro",adaptacoes:["Moto G04","Moto G24","Redmi Note 13 Pro"]},
{marca:"Infinix",modelo:"Hot 11",adaptacoes:["Galaxy A13","Moto G9 Power","Moto G200"]},
{marca:"Infinix",modelo:"Hot 11S",adaptacoes:["Moto G200"]},
{marca:"Infinix",modelo:"Hot 20 5G",adaptacoes:["Moto G9","Moto G8 Power Lite"]},
{marca:"Infinix",modelo:"Hot 20i",adaptacoes:["Moto G8 Power Lite","Galaxy A20S"]},
{marca:"Infinix",modelo:"Hot 30",adaptacoes:["Moto G200"]},
{marca:"Infinix",modelo:"Hot 30i",adaptacoes:["Moto G200"]},
{marca:"Infinix",modelo:"Hot 40",adaptacoes:["Moto G13","Moto G24"]},
{marca:"Infinix",modelo:"Hot 40i",adaptacoes:["Galaxy A73","Moto G04","Moto G24"]},
{marca:"Infinix",modelo:"Note 12 Pro 5G",adaptacoes:["Galaxy A80"]},
{marca:"Infinix",modelo:"Note 30 5G",adaptacoes:["Moto G200"]},
{marca:"Infinix",modelo:"Note 50",adaptacoes:["Moto G9+"]},
{marca:"Infinix",modelo:"Note 60i",adaptacoes:["Moto G15"]},

/* ================= Realme ================= */
{marca:"Realme",modelo:"7",adaptacoes:["Sem Adaptação"]},
{marca:"Realme",modelo:"8",adaptacoes:["Sem Adaptação"]},
{marca:"Realme",modelo:"C2",adaptacoes:["Galaxy A23","Galaxy A22","Galaxy A02"]},
{marca:"Realme",modelo:"C11",adaptacoes:["Moto E13","Moto E30","Moto G9 Play","Galaxy A02S","Moto G30","Moto E7 Power","Moto One Fusion","Galaxy A12","Galaxy A70"]},
{marca:"Realme",modelo:"C33",adaptacoes:["Moto G8 Power Lite","Galaxy A12","Poco C3","Galaxy A05","Redmi 13C","Realme Note 50","Realme Note 60"]},
{marca:"Realme",modelo:"C75",adaptacoes:["Moto G05","Moto G15"]},
{marca:"Realme",modelo:"Note 50",adaptacoes:["Galaxy A05","Redmi 13C","Realme C33","Realme Note 60"]},
{marca:"Realme",modelo:"Note 60",adaptacoes:["Galaxy A05","Redmi 13C","Realme C33","Realme Note 50"]},

/* ================= Asus ================= */
{marca:"Asus",modelo:"Zenfone Max Shot",adaptacoes:["Sem Adaptação"]},
{marca:"Asus",modelo:"Zenfone 6",adaptacoes:["Galaxy A51","Galaxy S21 FE"]},

/* ================= Nokia ================= */
{marca:"Nokia",modelo:"TA-1263",adaptacoes:["Moto Z3 Play"]},
{marca:"Nokia",modelo:"2.4",adaptacoes:["Moto G9","Moto G9 Play"]},

/* ================= Itel ================= */
{marca:"Itel",modelo:"A50",adaptacoes:["Galaxy A13","Moto G9","Moto G9 Play"]},
{marca:"Itel",modelo:"A70",adaptacoes:["Galaxy A22 5G","Galaxy A12","Galaxy A70"]},

/* ================= Tecno ================= */
{marca:"Tecno",modelo:"KG5J",adaptacoes:["Moto G9 Play"]},
{marca:"Tecno",modelo:"Pop 7",adaptacoes:["Moto G8 Power Lite"]},

/* ================= Oscal ================= */
{marca:"Oscal",modelo:"C80",adaptacoes:["Moto G8 Power Lite"]},

/* ================= Lg ================= */
{marca:"Lg",modelo:"K11",adaptacoes:["Sem Adaptação"]},
{marca:"Lg",modelo:"K40S",adaptacoes:["Galaxy A10","Galaxy A10S","Galaxy M10","Moto G8 Play","Moto G8 Plus","Moto G7","Redmi 8","Redmi 8A"]},
{marca:"Lg",modelo:"K61",adaptacoes:["Poco X3","Poco X3 Pro","Poco X4","Poco X4 Pro","Poco X4 GT","Galaxy A71","Galaxy M51","Galaxy S10 Lite","Redmi Note 10 Pro","Redmi Note 11 Pro","Redmi Mi 11i"]},

/* ================= Oppo ================= */
{marca:"Oppo",modelo:"A40",adaptacoes:["Moto G05•G15"]},

/* ================= Jovi ================= */
{marca:"Jovi",modelo:"V2445",adaptacoes:["Moto G05•G15"]},
{marca:"Jovi",modelo:"Y29",adaptacoes:["Moto G56"]},

/* ================= TCL ================= */
{marca:"TCL",modelo:"40",adaptacoes:["Galaxy A05","Galaxy A05S","Redmi 13C","Redmi C65","Realme C33","Realme Note 50","Realme Note 60"]},

];

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabName).classList.add('active');
  if (btn) {
    btn.classList.add('active');
  } else {
    event.currentTarget.classList.add('active');
  }
}

const normalizar = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

// Pré-computa os campos normalizados de cada item UMA vez ao carregar a página,
// em vez de normalizar o array inteiro (marca + modelo + todas as adaptações)
// a cada tecla digitada. Isso é o que mais pesava na busca com muitos resultados.
dados.forEach(d => {
  d._marcaNorm = normalizar(d.marca);
  d._modeloNorm = normalizar(d.modelo);
  d._adaptNorm = d.adaptacoes ? d.adaptacoes.map(normalizar) : [];
});

const resultadoEl = document.getElementById('resultado');
const buscaInput = document.getElementById('busca');
let debounceTimer = null;

/* ============================================================
   SISTEMA DE AVALIAÇÃO DAS ADAPTAÇÕES (like / deslike)
   ============================================================
   Cada loja pode avaliar se uma adaptação "dá certo" (👍) ou
   "dá errado" (👎). Os votos ficam salvos no Firebase (Firestore),
   compartilhados entre todas as lojas que acessarem o site.

   Regras de negócio (ajuste as constantes abaixo se quiser):
   - MIN_VOTOS_REMOCAO: quantos votos uma adaptação precisa
     acumular antes de poder ser escondida automaticamente.
   - LIMITE_REPROVACAO: % de deslike a partir do qual, já tendo
     o mínimo de votos, a adaptação some da lista (mas o
     histórico de votos continua salvo no banco).
   ============================================================ */
const MIN_VOTOS_REMOCAO = 3;
const LIMITE_REPROVACAO = 50; // em %

let avaliacoesCache = {}; // slug -> {likes, dislikes}
let avaliacoesCarregadas = false;

function slugAvaliacao(marca, modelo, adaptacao) {
  return normalizar(marca + modelo) + '__' + normalizar(adaptacao);
}

function votosDoSlug(slug) {
  return avaliacoesCache[slug] || { likes: 0, dislikes: 0 };
}

function statusAdaptacao(slug) {
  const { likes, dislikes } = votosDoSlug(slug);
  const total = likes + dislikes;
  if (total === 0) return { total: 0, pctAprovacao: null, reprovada: false };
  const pctAprovacao = Math.round((likes / total) * 100);
  const pctReprovacao = 100 - pctAprovacao;
  const reprovada = total >= MIN_VOTOS_REMOCAO && pctReprovacao >= LIMITE_REPROVACAO;
  return { total, pctAprovacao, reprovada };
}

async function carregarAvaliacoes() {
  if (typeof db === 'undefined') return; // Firebase não configurado ainda
  try {
    const snap = await db.collection('avaliacoes').get();
    const novoCache = {};
    snap.forEach(doc => { novoCache[doc.id] = doc.data(); });
    avaliacoesCache = novoCache;
  } catch (e) {
    console.warn('Não foi possível carregar as avaliações do Firebase:', e);
  } finally {
    avaliacoesCarregadas = true;
    renderResultados(buscaInput.value);
  }
}

async function votar(slug, tipo, event) {
  if (event) event.stopPropagation();
  if (typeof db === 'undefined') {
    alert('O banco de dados ainda não foi configurado neste site (veja as instruções no início do script.js).');
    return;
  }
  const chaveLocal = 'voto_' + slug;
  if (localStorage.getItem(chaveLocal)) {
    return; // esta loja/navegador já votou nesta adaptação
  }
  const campo = tipo === 'like' ? 'likes' : 'dislikes';
  const ref = db.collection('avaliacoes').doc(slug);
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const atual = doc.exists ? doc.data() : { likes: 0, dislikes: 0 };
      const novo = { likes: atual.likes || 0, dislikes: atual.dislikes || 0 };
      novo[campo] += 1;
      t.set(ref, novo, { merge: true });
    });
    localStorage.setItem(chaveLocal, tipo);
    const doc = await ref.get();
    avaliacoesCache[slug] = doc.data();
    renderResultados(buscaInput.value);
  } catch (e) {
    console.error(e);
    alert('Não foi possível registrar o voto agora. Verifique a conexão com a internet.');
  }
}
window.votar = votar;

function renderTagsAdaptacoes(marca, modelo, adaptacoes) {
  if (!adaptacoes || adaptacoes[0] === "Sem Adaptação") {
    return '<span class="no-adapt">Sem adaptações compatíveis</span>';
  }

  const visiveis = adaptacoes.filter(a => {
    if (!avaliacoesCarregadas) return true; // antes de carregar, mostra tudo
    return !statusAdaptacao(slugAvaliacao(marca, modelo, a)).reprovada;
  });

  if (!visiveis.length) {
    return '<span class="no-adapt">As adaptações cadastradas foram reprovadas pelas lojas.</span>';
  }

  return visiveis.map(a => {
    const slug = slugAvaliacao(marca, modelo, a);
    const st = statusAdaptacao(slug);
    const votoAtual = localStorage.getItem('voto_' + slug);
    return `
      <span class="tag">
        <span class="tag-texto">${a}</span>
        ${st.total > 0 ? `<span class="tag-pct" title="${st.total} avaliação(ões) de lojas">${st.pctAprovacao}% 👍</span>` : ''}
        <span class="tag-votos">
          <button type="button" class="voto-btn voto-like${votoAtual === 'like' ? ' votado' : ''}"
                  onclick="votar('${slug}','like',event)" title="Essa adaptação funciona" ${votoAtual ? 'disabled' : ''}>👍</button>
          <button type="button" class="voto-btn voto-dislike${votoAtual === 'dislike' ? ' votado' : ''}"
                  onclick="votar('${slug}','dislike',event)" title="Essa adaptação não funciona" ${votoAtual ? 'disabled' : ''}>👎</button>
        </span>
      </span>`;
  }).join('');
}

function renderVazio(mensagemHtml) {
  resultadoEl.innerHTML = `<div class="vazio">${mensagemHtml}</div>`;
}

function renderResultados(busca) {
  if (!busca) {
    renderVazio(`<i class="fas fa-mobile-alt"></i><p>Digite o modelo ou fabricante para buscar compatibilidade de películas.</p>`);
    return;
  }

  const f = normalizar(busca);

  // Uma única varredura no array em vez de até 3 (marca, depois modelo, depois
  // adaptações), classificando por relevância para manter marca/modelo primeiro.
  let porMarca = [], porModelo = [], porAdaptacao = [];
  for (const d of dados) {
    if (d._marcaNorm.includes(f)) { porMarca.push(d); continue; }
    if (d._modeloNorm.includes(f)) { porModelo.push(d); continue; }
    if (d._adaptNorm.some(a => a.includes(f))) { porAdaptacao.push(d); }
  }
  let resultados = porMarca.length ? porMarca : (porModelo.length ? porModelo : porAdaptacao);

  if (!resultados.length) {
    renderVazio(`<i class="fas fa-search"></i><p>Nenhuma compatibilidade encontrada para "<strong>${busca}</strong>".</p>`);
    return;
  }

  const frag = document.createDocumentFragment();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = resultados.map((d, i) => `
    <div class="card" style="animation-delay:${Math.min(i, 12) * 0.04}s">
      <div class="card-header">
        <img class="brand-logo" loading="lazy" src="logos/${d.marca.toLowerCase()}.png" alt="${d.marca}"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>📱</text></svg>'">
        <div class="card-info">
          <div class="modelo">${d.modelo}</div>
          <div class="marca">${d.marca}</div>
        </div>
      </div>
      <div class="adaptacoes">
        <div class="adaptacoes-title">
          <i class="fas fa-exchange-alt"></i>
          Adaptação compatível
        </div>
        <div class="adaptacoes-list">
          ${renderTagsAdaptacoes(d.marca, d.modelo, d.adaptacoes)}
        </div>
      </div>
    </div>
  `).join('');
  frag.appendChild(wrapper);
  resultadoEl.replaceChildren(...wrapper.childNodes);
}

buscaInput.addEventListener('input', (e) => {
  const valor = e.target.value;
  clearTimeout(debounceTimer);
  // Pequeno atraso: evita refazer a busca e re-renderizar os cards a cada
  // tecla enquanto a pessoa ainda está digitando (isso é o que mais trava
  // a digitação quando há muitos resultados na tela).
  debounceTimer = setTimeout(() => renderResultados(valor), 150);
});

carregarAvaliacoes();

const cores = {
  samsung: { fundo:"#1428a0", texto:"#ffffff" },
  motorola: { fundo:"#001526", texto:"#ffffff" },
  xiaomi: { fundo:"#ff6a08", texto:"#000000" },
  apple: { fundo:"#dcdcdc", texto:"#000000" },
  asus: { fundo:"#000000", texto:"#ffffff" },
  infinix: { fundo:"#8ec142", texto:"#000000" },
  itel: { fundo:"#fd0137", texto:"#ffffff" },
  lg: { fundo:"#a50034", texto:"#ffffff" },
  nokia: { fundo:"#1c4598", texto:"#ffffff" },
  oppo: { fundo:"#006b33", texto:"#ffffff" },
  oscal: { fundo:"#9c40dd", texto:"#ffffff" },
  realme: { fundo:"#ffc913", texto:"#000000" },
  tecno: { fundo:"#0064fe", texto:"#ffffff" },
  jovi: { fundo:"#1c4598", texto:"#ffffff" }
};

const fabricantes = [...new Set(dados.map(d => d.marca))].sort();

const fabSelect = document.getElementById('fabricante');
fabricantes.forEach(f => {
  const opt = document.createElement('option');
  opt.value = f;
  opt.textContent = f;
  fabSelect.appendChild(opt);
});

const fabSelectCapa = document.getElementById('fabricanteCapa');
fabricantes.forEach(f => {
  const opt = document.createElement('option');
  opt.value = f;
  opt.textContent = f;
  fabSelectCapa.appendChild(opt);
});

fabSelect.addEventListener('change', () => {
  const modeloSelect = document.getElementById('modelo');
  modeloSelect.innerHTML = '<option value="">Modelo</option>';
  modeloSelect.disabled = !fabSelect.value;
  
  if (fabSelect.value) {
    const modelos = dados.filter(d => d.marca === fabSelect.value).map(d => d.modelo);
    modelos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modeloSelect.appendChild(opt);
    });
  }
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function gerarImagemPelicula() {
  const fabricante = document.getElementById('fabricante').value;
  const modelo = document.getElementById('modelo').value;
  
  if (!fabricante || !modelo) {
    alert("Selecione a fabricante e o modelo!");
    return;
  }

  const achado = dados.find(d => d.marca === fabricante && d.modelo === modelo);
  if (!achado) {
    alert("Modelo não encontrado!");
    return;
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  const est = cores[achado.marca.toLowerCase()] || { fundo:"#fff", texto:"#000" };

  ctx.clearRect(0, 0, 591, 591);
  ctx.fillStyle = est.fundo;
  ctx.fillRect(0, 0, 591, 591);

  const b = 12;
  ctx.fillStyle = "#0051ff";
  ctx.fillRect(0, 0, 591, b);
  ctx.fillRect(0, 0, b, 591);
  ctx.fillStyle = "#ff7a00";
  ctx.fillRect(0, 591 - b, 591, b);
  ctx.fillRect(591 - b, 0, b, 591);

  ctx.textAlign = "center";
  ctx.fillStyle = est.texto;
  ctx.textBaseline = "alphabetic";

  let y = b + 20;

  const boxW = 300, boxH = 110;
  const boxX = (591 - boxW) / 2;
  const boxY = y;

  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 9;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#fff";
  roundRect(ctx, boxX, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const logo = new Image();
  logo.src = `logo2/${achado.marca.toLowerCase()}.png`;
  logo.onload = () => {
    const imgW = boxW - 40;
    const imgH = logo.height * (imgW / logo.width);
    ctx.drawImage(logo, boxX + (boxW - imgW) / 2, boxY + (boxH - imgH) / 2, imgW, imgH);
  };

  y = boxY + boxH + 50;

  let tamanho = 65;
  do {
    ctx.font = `bold ${tamanho}px Arial`;
    tamanho--;
  } while (ctx.measureText(achado.modelo).width > 591 - 60);

  ctx.fillStyle = est.texto;
  ctx.fillText(achado.modelo, 591 / 2, y);

  y += 60;

  ctx.font = "bold 30px Arial";
  ctx.fillText("Adaptações:", 591 / 2, y);

  y += 25;

  const areaAltura = 591 - y - b - 10;
  const areaLargura = 591 - 50;
  const numAdaptacoes = achado.adaptacoes.length;
  
  let colunas;
  if (numAdaptacoes <= 5) colunas = 1;
  else if (numAdaptacoes <= 10) colunas = 2;
  else if (numAdaptacoes <= 18) colunas = 3;
  else colunas = 4;
  
  const linhasPorCol = Math.ceil(numAdaptacoes / colunas);
  const gap = 17;
  const larguraCol = (areaLargura - (gap * (colunas - 1))) / colunas;
  
  let fonte = 35;
  let espacamento = fonte * 0.45;
  
  while ((linhasPorCol * (fonte + espacamento)) > areaAltura && fonte > 15) {
    fonte -= 1;
    espacamento = fonte * 0.45;
  }
  
  ctx.font = `bold ${fonte}px Arial`;
  let textoMuitoLongo = true;
  
  while (textoMuitoLongo && fonte > 15) {
    textoMuitoLongo = false;
    ctx.font = `bold ${fonte}px Arial`;
    
    achado.adaptacoes.forEach(t => {
      if (ctx.measureText(t).width > larguraCol - 8) textoMuitoLongo = true;
    });
    
    if (textoMuitoLongo) {
      fonte -= 1;
      espacamento = fonte * 0.45;
    }
  }
  
  ctx.font = `bold ${fonte}px Arial`;
  const inicioX = (591 - ((larguraCol * colunas) + (gap * (colunas - 1)))) / 2;
  const alturaTotal = linhasPorCol * (fonte + espacamento) - espacamento;
  const yInicio = y + (areaAltura - alturaTotal) / 2;
  
  achado.adaptacoes.forEach((t, i) => {
    const col = Math.floor(i / linhasPorCol);
    const lin = i % linhasPorCol;
    const x = inicioX + col * (larguraCol + gap) + larguraCol / 2;
    const yy = yInicio + lin * (fonte + espacamento);
    ctx.fillText(t, x, yy);
  });
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function addDpiToPng(base64Data, dpi) {
  const base64 = base64Data.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const ppm = Math.round(dpi / 0.0254);
  const ppmBytes = new Uint8Array([
    (ppm >> 24) & 0xFF,
    (ppm >> 16) & 0xFF,
    (ppm >> 8) & 0xFF,
    ppm & 0xFF
  ]);

  const physData = new Uint8Array(9);
  physData.set(ppmBytes, 0);
  physData.set(ppmBytes, 4);
  physData[8] = 1;

  const crcData = new Uint8Array(4 + 9);
  crcData[0] = 0x70; crcData[1] = 0x48; crcData[2] = 0x59; crcData[3] = 0x73;
  crcData.set(physData, 4);
  const crc = crc32(crcData);

  const crcBytes = new Uint8Array([
    (crc >> 24) & 0xFF,
    (crc >> 16) & 0xFF,
    (crc >> 8) & 0xFF,
    crc & 0xFF
  ]);

  const physChunk = new Uint8Array(4 + 4 + 9 + 4);
  physChunk[0] = 0; physChunk[1] = 0; physChunk[2] = 0; physChunk[3] = 9;
  physChunk[4] = 0x70; physChunk[5] = 0x48; physChunk[6] = 0x59; physChunk[7] = 0x73;
  physChunk.set(physData, 8);
  physChunk.set(crcBytes, 17);

  const newBytes = new Uint8Array(bytes.length + physChunk.length);
  newBytes.set(bytes.subarray(0, 33), 0);
  newBytes.set(physChunk, 33);
  newBytes.set(bytes.subarray(33), 33 + physChunk.length);

  let binary = '';
  for (let i = 0; i < newBytes.length; i++) {
    binary += String.fromCharCode(newBytes[i]);
  }
  return 'data:image/png;base64,' + btoa(binary);
}

function baixarImagemPelicula() {
  const fabricante = document.getElementById('fabricante').value;
  const modelo = document.getElementById('modelo').value;
  
  if (!fabricante || !modelo) {
    alert("Gere a imagem primeiro!");
    return;
  }

  const canvas = document.getElementById('canvas');
  const a = document.createElement("a");
  a.download = `${fabricante} ${modelo}.png`;
  a.href = addDpiToPng(canvas.toDataURL("image/png"), 300);
  a.click();
}

function gerarImagemCapa() {
  const fabricante = document.getElementById('fabricanteCapa').value;
  const linha1 = document.getElementById('linha1Capa').value.trim();
  const linha2 = document.getElementById('linha2Capa').value.trim();
  const linha3 = document.getElementById('linha3Capa').value.trim();
  
  if (!fabricante || (!linha1 && !linha2 && !linha3)) {
    alert("Selecione a fabricante e preencha pelo menos uma linha do modelo!");
    return;
  }

  const canvas = document.getElementById('canvasCapa');
  const ctx = canvas.getContext("2d");
  const est = cores[fabricante.toLowerCase()] || { fundo:"#0047AB", texto:"#000000" };

  // 1. Fundo totalmente branco
  ctx.clearRect(0, 0, 591, 591);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 591, 591);

  // 2. Borda com a cor da fabricante selecionada
  const b = 15;
  ctx.fillStyle = est.fundo;
  ctx.fillRect(0, 0, 591, b);
  ctx.fillRect(0, 0, b, 591);
  ctx.fillRect(0, 591 - b, 591, b);
  ctx.fillRect(591 - b, 0, b, 591);

  // 3. Círculo preto de 5x5 mm (marca de corte/furo)
  const mmToPx = 591 / 50;
  const raioCirculo = 2.5 * mmToPx; 
  const centroX = 25 * mmToPx;      
  const centroY = 10 * mmToPx;      

  ctx.beginPath();
  ctx.arc(centroX, centroY, raioCirculo, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // 4. Box para a logo da fabricante (posicionado abaixo do círculo)
  const boxW = 320;
  const boxH = 120;
  const boxX = (591 - boxW) / 2;
  const boxY = 180; 



  // 5. Carregar e desenhar a logo
  const logo = new Image();
  logo.src = `logo2/${fabricante.toLowerCase()}.png`;
  
  const linhasTexto = [linha1, linha2, linha3].filter(l => l !== "");
  
  logo.onload = () => {
    const maxImgW = boxW - 40;
    const imgRatio = logo.width / logo.height;
    let imgW = maxImgW;
    let imgH = imgW / imgRatio;
    
    if (imgH > boxH - 20) {
      imgH = boxH - 20;
      imgW = imgH * imgRatio;
    }
    
    ctx.drawImage(logo, boxX + (boxW - imgW) / 2, boxY + (boxH - imgH) / 2, imgW, imgH);
    desenharTextoModeloCapa(ctx, linhasTexto, b, boxY + boxH);
  };
  
  // Fallback caso a imagem não carregue
  logo.onerror = () => {
    ctx.fillStyle = est.fundo;
    ctx.font = "bold 42px Arial";
    ctx.fillText(fabricante.toUpperCase(), 591 / 2, boxY + boxH / 2 + 15);
    desenharTextoModeloCapa(ctx, linhasTexto, b, boxY + boxH);
  };
}

function desenharTextoModeloCapa(ctx, linhasTexto, b, startY) {
  let y = startY + 40;
  ctx.fillStyle = "#000000"; 
  ctx.textAlign = "center";
  
  const maxWidth = 591 - 80; // Margem de 40px de cada lado
  let tamanhoFonte = 60;
  
  // Filtrar linhas vazias
  const linhas = linhasTexto.filter(l => l.length > 0);
  
  // Ajustar fonte para caber na largura máxima
  while (tamanhoFonte >= 30) {
    let cabe = true;
    ctx.font = `bold ${tamanhoFonte}px Arial`;
    for (let i = 0; i < linhas.length; i++) {
      if (ctx.measureText(linhas[i]).width > maxWidth) {
        cabe = false;
        break;
      }
    }
    if (cabe) break;
    tamanhoFonte -= 2;
  }
  
  const alturaLinha = tamanhoFonte * 1.3;
  const alturaTotalTexto = linhas.length * alturaLinha;
  const espacoRestante = 591 - b - y;
  
  // Centralizar o bloco de texto no espaço restante abaixo da logo
  const yInicio = y + (espacoRestante - alturaTotalTexto) / 2 + alturaLinha;
  
  linhas.forEach((linha, i) => {
    ctx.fillText(linha, 591 / 2, yInicio + i * alturaLinha);
  });
}

function baixarImagemCapa() {
  const fabricante = document.getElementById('fabricanteCapa').value;
  const linha1 = document.getElementById('linha1Capa').value.trim();
  const linha2 = document.getElementById('linha2Capa').value.trim();
  const linha3 = document.getElementById('linha3Capa').value.trim();
  
  if (!fabricante || (!linha1 && !linha2 && !linha3)) {
    alert("Gere a imagem primeiro!");
    return;
  }

  const canvas = document.getElementById('canvasCapa');
  const partesModelo = [linha1, linha2, linha3].filter(p => p !== "").join(" ");
  const a = document.createElement("a");
  a.download = `${fabricante} ${partesModelo}.png`;
  a.href = addDpiToPng(canvas.toDataURL("image/png"), 300);
  a.click();
}

renderResultados('');
