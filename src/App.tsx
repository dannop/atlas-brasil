import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MapProvider } from '@/context/MapContext';
import Router from '@/router';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60,
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <MapProvider>
            <Router />
        </MapProvider>
    </QueryClientProvider>
);

export default App;
