import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {new Array(8).fill(null).map((t, i) => (
        <div key={i} className="border rounded-md p-4">
          <Skeleton className="w-full aspect-square" />
          <div className="py-2"></div>
          <Skeleton className="w-full h-4" />
          <div className="py-1"></div>
          <Skeleton className="w-full h-2" />
        </div>
      ))}
    </div>
  );
}
