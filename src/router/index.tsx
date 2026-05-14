import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MapPage from '@/pages/MapPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MapPage />,
    },
    {
        path: '*',
        element: <MapPage />,
    },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
