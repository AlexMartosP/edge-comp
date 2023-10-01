import prisma from "@/utils/prisma";
import Image from "next/image";

export const runtime = "edge";
export const preferredRegion = "arn1";

export default async function Page() {
  const products = await prisma.product.findMany();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Serverless rendered</h1>
      <div className="py-4"></div>
      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.SKU} className="border rounded-md p-4">
            <Image
              src={product.imageId}
              width={200}
              height={200}
              quality={80}
              alt={product.name}
              className="aspect-square w-full object-cover rounded-sm"
            />
            <div className="py-2"></div>
            <h3 className="font-semibold">{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
