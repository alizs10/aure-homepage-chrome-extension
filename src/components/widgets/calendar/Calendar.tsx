import CalendarContent from "./components/CalendarContent";
import CalendarNotesProvider from "./providers/CalendarNotesProvider";

export default function Calendar() {


    return (
        <CalendarNotesProvider>
            <CalendarContent />
        </CalendarNotesProvider>
    );
}