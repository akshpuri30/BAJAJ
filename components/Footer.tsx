"use client";

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-24 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-mono uppercase tracking-widest">
      <div className="flex gap-6 mb-4 md:mb-0">
        <p>ID: akshpuri_30012004</p>
        <p>Email: ap1945@srmist.edu.in</p>
        <p>Roll: ra2311026010450</p>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Aksh Puri
      </div>
    </footer>
  );
}
