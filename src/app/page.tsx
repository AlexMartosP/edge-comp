import APIFetcher from "./APIFetcher";

export default function Home() {
  return (
    <div>
      <h1 className="font-semibold text-2xl">Route handlers</h1>
      <div className="py-2"></div>
      <APIFetcher />
    </div>
  );
}
