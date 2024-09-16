import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalLayout } from "./Layout/GlobalLayout.tsx";
import { PageError } from "./views/PageError.tsx";
import { SplashView } from "./views/SplashView.tsx";
import { Manager } from "socket.io-client";
import { globalUpdateSocket } from "./store/store.ts";
import { ToastContextProvider } from "./components/basic/Toast.tsx";
import { ObsConnection } from "./views/setup/ObsConnection.tsx";
import { Features } from "./views/Features.tsx";
import { LayoutSetup } from "./Layout/setup/LayoutSetup.tsx";
import { MappingObs } from "./views/setup/MappingObs.tsx";


const controllers = [
  {
    name: "OBS Studio (Open Broadcaster Software)",
    valid: true,
    description: "OBS Studio est un logiciel " +
      "open-source de diffusion en direct et " +
      "d'enregistrement vidéo. Il offre une grande" +
      " flexibilité grâce à sa gestion avancée des scènes, " +
      "des sources et des filtres, ainsi qu'une prise en charge " +
      "multi-plateforme (Windows, macOS, Linux). Conçu pour " +
      "les streamers et créateurs de contenu, il permet une " +
      "diffusion fluide et de haute qualité sur diverses plateformes.",
    
  },
  {
    name: "vMix",
    valid: false,
    description: "vMix est un logiciel de " +
      "production vidéo en direct puissant et" +
      "complet. Il prend en charge des sources " +
      "variées (caméras, vidéos, audio, graphiques) " +
      "et permet des transitions, effets et animations en " +
      "temps réel. Utilisé dans des environnements professionnels, " +
      "il est parfait pour la diffusion en direct, la production d'événements, " +
      "et la gestion de contenu multimédia de haute qualité.",
  },
  {
    name: "Open Sound Control (OSC)",
    valid: false,
    description: "OSC est un protocole de " +
      "communication flexible, utilisé " +
      "principalement pour le contrôle d'équipements audio, " +
      "vidéo et multimédias à distance. Il permet de transmettre " +
      "des informations entre logiciels et appareils compatibles " +
      "sur un réseau local, assurant une communication fluide " +
      "et synchronisée pour les " +
      "environnements interactifs et les performances multimédias.",
  },
  {
    name: "XTV",
    valid: false,
    description: "XTV est une solution logicielle de " +
      "gestion et d'automatisation pour la diffusion télévisuelle " +
      "et les chaînes OTT. Elle permet de gérer la programmation, " +
      "le contrôle de diffusion, et la gestion de contenu vidéo de " +
      "manière fluide et centralisée. XTV est utilisé par des diffuseurs " +
      "pour automatiser les opérations " +
      "tout en assurant une diffusion continue et de haute qualité.",
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutSetup/>,
    children: [
      {
        path: "/",
        element: <SplashView controllers={controllers}/>,
      },
      {
        path: "/obs/connection",
        element: <ObsConnection/>,
      },
      {
        path: "/features",
        element: <Features/>,
      },
      {
        path: "/features/controller/obs",
        element: <MappingObs/>,
      },
    ],
  },
  {
    path: "/home",
    element: <GlobalLayout/>,
    errorElement: <PageError/>,
    children: [
      {
        path: "",
        element: <App/>,
      },
      {
        path: "blog",
        children: [
          {
            path: "",
            element: <div>Mon Blog</div>,
          },
        ],
      }, {
        path: "setting",
        element: <div>setting</div>,
      },
    ],
  },
]);

const url = window.location;
const baseUrl = url.pathname.split("/")[1];
const address = `http://localhost:3000/${baseUrl}`;
const ioPath = (baseUrl ? `/${baseUrl}` : "") + "/socket.io";

const manager = new Manager(address, {
  path: ioPath,
});

const socket = manager.socket("/");

globalUpdateSocket(socket);

socket.on("connect", () => {
  console.log("client connect");
});


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContextProvider>
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </ToastContextProvider>
  </StrictMode>,
);
