import type { Pet } from "../types";

const MAX_AGE = {
    cat: 10,
    dog: 15,
} as const;

export const FEEDS_PER_DAY = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const PET_DAYS_PER_YEAR = 365;
const PET_DAYS_PER_MONTH = 30;

/**
 * 1 real day = 1 pet year
 */
export function getPetAge(pet: Pet) {
    return Math.floor((Date.now() - pet.createdAt) / MS_PER_DAY);
}

export function getPetDetailsAge(pet: Pet) {
    // 1 real day = 365 pet days
    const totalPetDays = Math.floor(
        ((Date.now() - pet.createdAt) / MS_PER_DAY) * PET_DAYS_PER_YEAR
    );

    const years = Math.floor(totalPetDays / PET_DAYS_PER_YEAR);

    const months = Math.floor(
        (totalPetDays % PET_DAYS_PER_YEAR) / PET_DAYS_PER_MONTH
    );

    const days = (totalPetDays % PET_DAYS_PER_YEAR) % PET_DAYS_PER_MONTH;

    return {
        years,
        months,
        days,
    };
}

export function getPetAgeLabel(pet: Pet) {
    const { years, months, days } = getPetDetailsAge(pet);

    const parts: string[] = [];

    if (years) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
    if (days || parts.length === 0)
        parts.push(`${days} day${days !== 1 ? "s" : ""}`);

    return parts.join(" ");
}

export function isPetDeadByAge(pet: Pet): boolean {
    return getPetAge(pet) >= MAX_AGE[pet.type];
}

/**
 * Total number of feeds the pet should have received by now.
 */
export function getRequiredFeedCount(pet: Pet): number {
    const daysAlive = getPetAge(pet); // include today

    return daysAlive * FEEDS_PER_DAY;
}

/**
 * Dead if it has missed at least one required meal.
 */
export function isPetDeadByStarvation(pet: Pet): boolean {

    return pet.hasBeenFeedCount < getRequiredFeedCount(pet);
}

export function isPetDead(pet: Pet): boolean {

    return isPetDeadByAge(pet) || isPetDeadByStarvation(pet);
}

/**
 * Meals left for today.
 */
export function getRemainingFoodToday(pet: Pet): number {
    const age = getPetAge(pet);

    const feedsBeforeToday = age * FEEDS_PER_DAY;

    const fedToday = Math.max(
        0,
        pet.hasBeenFeedCount - feedsBeforeToday
    );

    return Math.max(0, FEEDS_PER_DAY - fedToday);
}