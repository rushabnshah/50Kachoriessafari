export const partyDays = [
  {
    id: "roots",
    date: "24 October",
    day: "Saturday",
    title: "Return to Our Roots",
    image: "/assets/party/days/day-roots-wide.jpg",
    dj: "DJ Frankie",
    description:
      "As many of us return to our birthplace, DJ Frankie will set the mood with old-school tunes for a nostalgic journey down memory lane. It is only fitting that we honour the country where it all began.",
    dressCode:
      "Colours of the Kenya flag. Please wear one dominant colour for the evening: red, black, green, or white.",
  },
  {
    id: "rave",
    date: "25 October",
    day: "Sunday",
    title: "The Rave",
    image: "/assets/party/days/day-rave-wide.jpg",
    dj: "DJ Açqé",
    description:
      "Prepare for an unforgettable evening on the Lantana beachfront as DJ Açqé takes over the decks and keeps the celebration going into the early hours.",
    dressCode:
      "Hawaiian or beachwear. To add to the fun, please make use of the props provided in your welcome party bags.",
  },
  {
    id: "wind-down",
    date: "26 October",
    day: "Monday",
    title: "The Wind Down",
    image: "/assets/party/days/day-bollywood-wide.jpg",
    dj: null,
    description:
      "As the party weekend draws to a close, we’ll ease into a relaxed evening of melodic Bollywood classics to complement the Indian catering set out for the night.",
    dressCode:
      "None – please wear whatever makes you feel comfortable.",
  },
] as const

export type PartyDay = (typeof partyDays)[number]
