import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function ScheduleCalendar({ setCurrentStep }) {
    const [events, setEvents] = useState([]);

    const handleSelect = ({ start, end }) => {
        // This function is called when a user selects a time slot in the calendar.
        const title = window.prompt('Enter the event name');
        if (title) {
            setEvents([...events, { start, end, title }]);
            // TODO: Save this event to the backend
        }
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={events}
                style={{ height: '100%' }}
                onSelectSlot={handleSelect}
                selectable={true}
            />
        </div>
    );
}

export default ScheduleCalendar;
