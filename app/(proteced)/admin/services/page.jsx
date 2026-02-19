import ServicesTabel from "@/app/(admin)/tables/servicesTabel";
import { getServiceData } from "@/lib/functions";


const AdminServices = async () => {
    const services = await getServiceData();
    return (
        <div className="flex flex-col gap-5">
            <h6 className="font-semibold">Our Services </h6>
            <ServicesTabel AllServices={services} />
        </div>
    );
};

export default AdminServices;
