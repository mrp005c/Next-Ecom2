// products/[id]/page.js

import ProductPage from "./ProductPage";

export async function generateMetadata(props) {
    const params = await props.params;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const id = await params.id;

    const res = await fetch(
        `${baseUrl}/api/products/product?productId=${id}`,
        { cache: "no-store" }
    );
    const data = await res.json();

    if (!data.success) {
        return {
            title: "Product Not Found",
            description: "This product does not exist.",
        };
    }

    return {
        title: data.result.name + " | Next Ecom",
        description: data.result.description?.slice(0, 150) || "Product details",
        openGraph: {
            title: data.result.name,
            description: data.result.description,
            images: data.result.image,
        },
    };
}


export default async function Page(props) {
    const params = await props.params;
    const id = await params.id;
    return <ProductPage id={params.id} />;
}
