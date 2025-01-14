import Link from "next/link";
import Image from "next/image";
//import { signOut } from "@/auth";
//import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Session } from "next-auth";

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
};

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="text-sm bg-primary">
                {getInitials(session?.user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
        {/* <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mb-10"
          >
            <Button asChild>
              <Avatar>
                <AvatarFallback className="text-sm">
                  {getInitials(session?.user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </form>
        </li> */}
      </ul>
    </header>
  );
};

export default Header;
