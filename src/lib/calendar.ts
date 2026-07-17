export interface BookedSlot {
  start: string;
  end: string;
}

/**
 * Maps a standard slot hour string (e.g., '09:30 AM', '01:30 PM') to its 24-hour 'HH:MM:SS' format.
 */
export const mapSlotTo24h = (timeStr: string): string => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "12:00:00";
  
  const [_, hoursStr, minutesStr, ampm] = match;
  let hours = parseInt(hoursStr);
  
  if (ampm.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  
  const h = hours.toString().padStart(2, "0");
  const m = minutesStr.padStart(2, "0");
  return `${h}:${m}:00`;
};

/**
 * Calculates and returns the end dateTime ISO string (15 minutes after start) for a given date and slot time.
 */
export const getEndDateTime = (dateStr: string, timeStr: string): string => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return `${dateStr}T12:15:00+01:00`;
  
  const [_, hoursStr, minutesStr, ampm] = match;
  let hours = parseInt(hoursStr);
  let minutes = parseInt(minutesStr);
  
  if (ampm.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  
  minutes += 15;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }
  if (hours >= 24) {
    hours -= 24;
  }
  
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  return `${dateStr}T${h}:${m}:00+01:00`;
};

/**
 * Fetches booked events on the primary calendar within the specified ISO range.
 */
export const fetchBookedEvents = async (accessToken: string, startDateIso: string, endDateIso: string): Promise<any[]> => {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startDateIso)}&timeMax=${encodeURIComponent(endDateIso)}&singleEvents=true&orderBy=startTime`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Error fetching calendar events:', errText);
    throw new Error(errText);
  }

  const data = await response.json();
  return data.items || [];
};

/**
 * Checks if a specific date and time slot overlaps with any booked Google Calendar events.
 */
export const isSlotBusy = (
  date: string,
  time: string,
  bookedEvents: any[]
): boolean => {
  const startIso = `${date}T${mapSlotTo24h(time)}+01:00`;
  const endIso = getEndDateTime(date, time);
  
  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();
  
  for (const event of bookedEvents) {
    const eventStart = event.start?.dateTime || event.start?.date;
    const eventEnd = event.end?.dateTime || event.end?.date;
    
    if (!eventStart || !eventEnd) continue;
    
    const eventStartMs = new Date(eventStart).getTime();
    const eventEndMs = new Date(eventEnd).getTime();
    
    // Check overlap: (start1 < end2) && (end1 > start2)
    if (startMs < eventEndMs && endMs > eventStartMs) {
      return true;
    }
  }
  
  return false;
};

/**
 * Creates a calendar event on the primary calendar with an automated Google Meet conference link.
 */
export const createCalendarMeetEvent = async (
  accessToken: string,
  details: {
    summary: string;
    description: string;
    date: string;
    time: string;
    attendeeEmail: string;
  }
): Promise<{ eventId: string; hangoutLink?: string }> => {
  const startIso = `${details.date}T${mapSlotTo24h(details.time)}+01:00`;
  const endIso = getEndDateTime(details.date, details.time);
  
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
  
  const body = {
    summary: details.summary,
    description: details.description,
    start: {
      dateTime: startIso,
      timeZone: 'Africa/Lagos'
    },
    end: {
      dateTime: endIso,
      timeZone: 'Africa/Lagos'
    },
    attendees: [
      { email: details.attendeeEmail }
    ],
    conferenceData: {
      createRequest: {
        requestId: `flow-os-book-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create calendar event: ${errText}`);
  }
  
  const createdEvent = await response.json();
  
  // Extract hangout link (Google Meet URI)
  const hangoutLink = createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;
  
  return {
    eventId: createdEvent.id,
    hangoutLink
  };
};
