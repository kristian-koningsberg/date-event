// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SickDialog({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return (
    <div className="w-fit">
      <Dialog>
        <DialogTrigger asChild>
          {/* <Button variant="default">Les melding</Button> */}
          <button className="bg-none p-0 rounded-md border-none underline">
            Les melding
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
