import { ArrowUpRight, Github, Waves } from "lucide-react";
import { ModeToggle } from "./dark-mode-toggle";
const Navbar = () => {
  return (
    <div className="flex flex-wrap items-center p-4 gap-3 justify-between sticky top-0 z-10 backdrop-blur-3xl border-b">
      <ul className="flex gap-5 items-center">
        <li>
          <a href="/" className="flex gap-1">
            <Waves className="h-6 w-6" />
            <span>TokenTide</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/rahulsm20/tokentide/blob/main/README.md"
            target="_blank"
            className="flex gap-1 hover:underline"
          >
            <span>About</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/rahulsm20/tokentide"
            target="_blank"
            className="flex items-center gap-1 hover:underline"
          >
            <span>Github</span>
            <Github className="h-4 w-4" />
          </a>
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
