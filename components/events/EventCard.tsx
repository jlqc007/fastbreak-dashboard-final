import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EventCardProps = {
  id: string;
  name: string;
  date: string;
  venue: string;
  sport: string;
};

export const EventCard = ({ id, name, date, venue, sport }: EventCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <Badge variant="sport">{sport}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{date}</p>
      <p className="text-sm">{venue}</p>
      <Link href={`/dashboard/${id}`}>
        <Button size="sm" variant="outline" className="mt-2 w-full">
          View Details
        </Button>
      </Link>
    </div>
  );
};
