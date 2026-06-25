import { prisma } from "./lib/prisma";

async function createAddressByUser() {

    const user = await prisma.user.findUnique({
        where: { id: "cmqnap97i0000xgeks80vr682" }
    });

    console.log(user)

    const address = await prisma.address.create({
        data: {
            userId: user?.id,
            label: "kantor",
            address: "Jl Sengah no 73A",
            subdistrictName: "Kalibata",
            districtName: "Pancoran",
            biteshipAreaId: "12940",
            cityName: "Jakarta Selatan",
            provinceName: "DKI Jakarta",
            postalCode: "12790",
        }
    });

    console.log(address);
}

async function checkUserAddresses() {
    const userAddresses = await prisma.user.findUnique({
        where: { id: "cmqnap97i0000xgeks80vr682" },
        include: { addresses: true }
    })

    console.log(userAddresses);
}

// createAddressByUser();
// checkUserAddresses();