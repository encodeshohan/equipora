export type Review = {
    name: string
    role: string
    rating: number
    comment: string
}

export const REVIEWS: Review[] = [
    {
        name: "Nusrat Jahan",
        role: "Event planner, Dhaka",
        rating: 5,
        comment:
            "I booked a tent and a sound system for a wedding in minutes. The owner confirmed fast and everything arrived on time.",
    },
    {
        name: "Tanvir Ahmed",
        role: "Site engineer, Chattogram",
        rating: 5,
        comment:
            "Renting a mixer by the day saved us from buying one. Pricing was clear and the payment was secure.",
    },
    {
        name: "Farhana Akter",
        role: "Photographer, Sylhet",
        rating: 4,
        comment:
            "Great camera kits at fair prices. I could filter by price and location, which made choosing easy.",
    },
    {
        name: "Rafiq Hossain",
        role: "Farmer, Rangpur",
        rating: 5,
        comment:
            "A tractor for the planting week without the cost of owning one. Listing my own idle sprayer was just as easy.",
    },
]