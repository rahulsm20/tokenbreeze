import { Github, Twitter } from "lucide-react";
import { Logo } from "./icons";

const Footer = () => {
  const socials = [
    {
      name: "Github",
      url: "https://github.com/rahulsm20/tokenbreeze",
      title: "Github",
      icon: <Github />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/boringBroccoli",
      title: "Twitter",
      icon: <Twitter />,
    },
  ];

  return (
    <footer className="border-t p-5 mt-10 gap-3 flex justify-around items-start bottom-0">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-start flex gap-2">
          <Logo /> TokenBreeze
        </p>
        <span className="text-sm text-zinc-500">
          Just another token price aggregator.
        </span>
        <div className="flex flex-col gap-3">
          <ul className="flex gap-2 list-disc ">
            {socials.map(({ name, url, title, icon }) => (
              <li key={name} className="flex gap-2">
                <a
                  href={url}
                  key={name}
                  target="_blank"
                  title={title}
                  className=" dark:text-zinc-300 hover:underline flex"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="flex gap-2 text-zinc-500 text-xs">© 2024 TokenBreeze</p>
      </div>
    </footer>
  );
};

export default Footer;
