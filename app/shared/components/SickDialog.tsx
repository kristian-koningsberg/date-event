import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuCalendarX2 } from "react-icons/lu";

export function SickDialog({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="text-orange-950 flex flex-col p-2 rounded-sm border border-orange-500 bg-orange-50 w-full cursor-pointer">
            <div>
              <div className="flex items-center gap-2">
                <LuCalendarX2 className="w-6" />
                <strong className="">{name}</strong>
              </div>
              <div className="hidden md:block">
                <i className="opacity-70 line-clamp-1">{message}</i>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-orange-500">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center md:items-start md:justify-start gap-2">
              <LuCalendarX2 className="w-6" />
              <DialogTitle>{name}</DialogTitle>
            </div>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
