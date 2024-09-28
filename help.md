import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Manager } from 'socket.io-client';
import useStore from '@src/store/store';  // Zustand store
import App from '@src/App';
import '@src/assets/css/index.css';
import 'uno.css';

// Import des vues
import SplashView from '@src/views/SplashView';
import LoadingView from '@src/views/LoadingView';
import HomeView from '@src/views/HomeView';
import RunningView from '@src/views/RunningView';
import DisconnectView from '@src/views/DisconnectView';

import SetupView from '@src/views/setup/IndexView';
import SetupLandingView from '@src/views/setup/LandingView';
import SetupProfileView from '@src/views/setup/ProfileView';
import SetupVisionMixerView from '@src/views/setup/VideoMixerView';
import SetupObsView from '@src/views/setup/ObsView';
import SetupVmixView from '@src/views/setup/VmixView';
import SetupOscView from '@src/views/setup/OscView';
import SetupAudioView from '@src/views/setup/AudioView';
import SetupMappingObsView from '@src/views/setup/MappingObsView';
import SetupMappingVmixView from '@src/views/setup/MappingVmixView';
import SetupMappingOscView from '@src/views/setup/MappingOscView';
import SetupSettingsView from '@src/views/setup/SettingsView';
import SetupSummaryView from '@src/views/setup/SummaryView';

const Redirection = ({ to }) => {
const connections = useStore((state) => state.profiles.connections);
const navigate = useNavigate();

useEffect(() => {
let path = to;
switch (to) {
case '/setup/vm-choice':
path = '/setup/' + connections.type;
break;
case '/setup/mapping':
path = '/setup/mapping-' + connections.type;
break;
default:
break;
}
navigate(path);
}, [to, navigate, connections]);

return null;
};

const BeforeEach = ({ children }) => {
const location = useLocation();
const navigate = useNavigate();
const { power, setRedirectPath, layout, redirect } = useStore((state) => ({
power: state.power,
setRedirectPath: state.setRedirectPath,
layout: state.layout,
redirect: state.redirect,
}));

useEffect(() => {
const toPath = location.pathname;

    if (!location.state && location.pathname !== '/' && location.pathname !== '/loading') {
      setRedirectPath(toPath);
      navigate('/loading');
    }

    if (['/running', '/loading'].indexOf(toPath) === -1 && power) {
      navigate('/running');
    } else if (toPath === '/running' && !power) {
      navigate('/home');
    }

    layout.header.iconEdit = false;
    layout.header.dotMenu = false;
    layout.footer.back.url = undefined;
    layout.footer.next.url = undefined;
    layout.footer.back.callback = undefined;
    layout.footer.next.callback = undefined;

    if (toPath.includes('redirect')) {
      navigate(toPath);
    }
}, [location, navigate, setRedirectPath, layout, power]);

return children;
};

const AfterEach = () => {
const location = useLocation();

useEffect(() => {
const { type: toType, order: toOrder } = location.state || {};
const { type: fromType, order: fromOrder } = location.state?.from || {};

    if (!fromType) {
      location.state = { transition: 'fade' };
    } else if (toType !== fromType) {
      switch (toType) {
        case 0:
          location.state = { transition: 'slide-bottom' };
          break;
        case 1:
          location.state = { transition: 'slide-top' };
          break;
        case 2:
        default:
          location.state = { transition: 'fade' };
          break;
      }
    } else {
      location.state = { transition: toOrder < fromOrder ? 'slide-right' : 'slide-left' };
    }
}, [location]);

return null;
};

const AppRouter = () => {
return (
<Router>
<BeforeEach>
<Routes>
<Route path="/" element={<SplashView />} />
<Route path="/loading" element={<LoadingView />} />
<Route path="/disconnect" element={<DisconnectView />} />
<Route path="/home" element={<HomeView />} />
<Route path="/running" element={<RunningView />} />
<Route path="/setup" element={<SetupView />}>
<Route path="landing" element={<SetupLandingView />} />
<Route path="profile" element={<SetupProfileView />} />
<Route path="audio" element={<SetupAudioView />} />
<Route path="video-mixer" element={<SetupVisionMixerView />} />
<Route path="vm-choice" element={<Redirection to="/setup/vm-choice" />} />
<Route path="obs" element={<SetupObsView />} />
<Route path="vmix" element={<SetupVmixView />} />
<Route path="osc" element={<SetupOscView />} />
<Route path="mapping" element={<Redirection to="/setup/mapping" />} />
<Route path="mapping-obs" element={<SetupMappingObsView />} />
<Route path="mapping-vmix" element={<SetupMappingVmixView />} />
<Route path="mapping-osc" element={<SetupMappingOscView />} />
<Route path="settings" element={<SetupSettingsView />} />
<Route path="summary" element={<SetupSummaryView />} />
</Route>
</Routes>
<AfterEach />
</BeforeEach>
</Router>
);
};

const url = window.location;
const baseUrl = url.pathname.split('/')[1];
let address = `${url.protocol}//${url.host}/${baseUrl}`;

if (import.meta.env.DEV) {
address = `${url.protocol}//${url.hostname}:1510/${baseUrl}`;
}

const ioPath = `${baseUrl ? `/${baseUrl}` : ''}/socket.io`;
const manager = new Manager(address, { path: ioPath });
const socket = manager.socket('/');

useStore.setState({ socket });

socket.on('connect', () => {
const redirectPath = useStore.getState().redirect.path;
if (redirectPath && window.location.pathname === '/disconnect') {
window.location.href = redirectPath;
}
});

socket.on('disconnect', (reason) => {
useStore.setState({ power: false });
const redirectPath = useStore.getState().redirect.path;
if (window.location.pathname !== '/disconnect') {
useStore.setState({ redirect: { path: window.location.pathname } });
}
window.location.href = '/disconnect';
if (reason === 'io server disconnect') {
socket.connect();
}
});

function RootApp() {
return (
<React.StrictMode>
<App />
<AppRouter />
</React.StrictMode>
);
}

export default RootApp;
