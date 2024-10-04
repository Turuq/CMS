// "use client";
import { DotIcon, Link } from "lucide-react";

export function HiddenCourierManagerNavbar() {
  return (
    <>
      <Link
        href={"/en/courier-manager"}
        className="flex items-center justify-start w-40 h-10 text-accent rounded-full text-sm"
      >
        <span className="font-bold">Home</span>
      </Link>
      <Link
        href={"/en/courier-manager/orders"}
        className="flex items-center justify-start gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
      >
        <span className="font-bold">Orders</span>
      </Link>
      <Link
        href={"/en/courier-manager/assign"}
        className="flex items-center justify-start gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
      >
        <span className="font-bold">Assign</span>
      </Link>
      <Link
        href={"/en/courier-manager/inspect"}
        className="flex items-center justify-start gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
      >
        <span className="font-bold">Inspect</span>
      </Link>
    </>
  );
}

export function CourierManagerNavbar() {
  return (
    <>
      {/* <Link
				href={"/en/courier-manager"}
				className="flex items-center justify-center w-40 h-10 text-accent border rounded-full text-sm"
			>
				<DotIcon size={16} className="text-inherit" />
				<span className="font-bold">Home</span>
			</Link>
			<Link
				href={"/en/courier-manager/orders"}
				className="flex items-center justify-center gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
			>
				<span className="font-bold">Orders</span>
			</Link>
			<Link
				href={"/en/courier-manager/assign"}
				className="flex items-center justify-center gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
			>
				<span className="font-bold">Assign</span>
			</Link>
			<Link
				href={"/en/courier-manager/inspect"}
				className="flex items-center justify-center gap-2 w-40 h-10 opacity-45 hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm"
			>
				<span className="font-bold">Inspect</span>
			</Link> */}
    </>
  );
}
