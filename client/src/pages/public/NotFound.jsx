import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-100"
            style={{ backgroundColor: "#070B14" }}
        >
            <p className="font-mono text-sm uppercase tracking-widest text-amber-400">
                404 — route not found
            </p>
            <h1 className="font-pixel text-4xl text-white">$ cd /home</h1>
            <Link
                to="/"
                className="mt-4 rounded-md bg-cyan-400 px-5 py-2.5 font-mono text-sm font-medium text-slate-950 hover:bg-cyan-300"
            >
                ← wapas jao
            </Link>
        </div>
    );
}
