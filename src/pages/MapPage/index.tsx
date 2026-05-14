import MapaBrasil from '@/components/organisms/MapaBrasil';
import MunicipioDrawer from '@/components/organisms/MunicipioDrawer';
import MapLayout from '@/components/template/MapLayout';

const MapPage = () => (
    <MapLayout>
        <MapaBrasil />
        <MunicipioDrawer />
    </MapLayout>
);

export default MapPage;
